import { beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  insert: vi.fn(),
  rpc: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  getBucket: vi.fn(),
  from: vi.fn(),
  limit: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  sessionClient: async () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("@/lib/supabase/admin", () => ({
  privileged: () => ({
    from: mocks.from,
    rpc: mocks.rpc,
    storage: {
      getBucket: mocks.getBucket,
      from: () => ({ upload: mocks.upload, remove: mocks.remove }),
    },
  }),
}));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    limit = mocks.limit;
  },
}));
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: () => ({}) } }));
import { requireAdmin } from "@/lib/auth";
import { contactSchema, safeUrl, portfolioSchema } from "@/lib/validation";
import {
  validatePdf,
  saveContact,
  saveApplication,
} from "@/lib/services/submissions";
import { POST as contact } from "@/app/api/contact/route";
import { GET as adminGet } from "@/app/api/admin/[resource]/route";
import { GET as resumeGet } from "@/app/api/admin/resume/[id]/route";
import { rateLimit } from "@/lib/rate-limit";
import { privateResumeBucket } from "@/lib/services/storage";
import { limitedFormData } from "@/lib/http";
const key = "123e4567-e89b-42d3-a456-426614174000";
const value = {
  name: "Test Person",
  email: "test@example.com",
  company: "",
  service: "Website",
  message: "A website brief",
  website: "",
  idempotency_key: key,
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.getBucket.mockResolvedValue({ data: { public: false }, error: null });
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test");
  vi.stubEnv("ADMIN_USER_IDS", key);
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
  vi.stubEnv("SUPABASE_RESUME_BUCKET", "resumes");
  vi.stubEnv("VERCEL", "");
  mocks.limit.mockResolvedValue({ success: true });
  mocks.getUser.mockResolvedValue({ data: { user: { id: key } }, error: null });
  mocks.insert.mockResolvedValue({ error: null });
  mocks.upload.mockResolvedValue({ error: null });
  mocks.remove.mockResolvedValue({ error: null });
});
describe("authorization", () => {
  it("verifies identity and allowlist", async () => {
    await expect(requireAdmin()).resolves.toMatchObject({ id: key });
    vi.stubEnv("ADMIN_USER_IDS", "");
    await expect(requireAdmin()).rejects.toMatchObject({ status: 403 });
  });
  it("rejects expired and invalid sessions", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "expired" },
    });
    await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
  });
  it("rejects non-admin users", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "other" } },
      error: null,
    });
    await expect(requireAdmin()).rejects.toMatchObject({ status: 403 });
  });
  it("denies direct data and resume endpoints without identity", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: {} });
    expect(
      (
        await adminGet(
          new Request("http://localhost:3000/api/admin/contacts"),
          { params: Promise.resolve({ resource: "contacts" }) },
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await resumeGet(
          new Request("http://localhost:3000/api/admin/resume/" + key),
          { params: Promise.resolve({ id: key }) },
        )
      ).status,
    ).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
describe("validation and rate limits", () => {
  it("refuses a public resume bucket", async () => {
    mocks.getBucket.mockResolvedValue({data:{public:true},error:null});
    await expect(privateResumeBucket()).rejects.toMatchObject({status:503});
  });
  it("bounds uploads without trusting content-length", async () => {
    const body=new FormData();body.set('resume',new File(['%PDF-1.7'],'resume.pdf',{type:'application/pdf'}));
    const accepted=await limitedFormData(new Request('http://localhost:3000',{method:'POST',body}),1000);
    expect(accepted.get('resume')).toBeInstanceOf(File);
    await expect(limitedFormData(new Request('http://localhost:3000',{method:'POST',body}),10)).rejects.toMatchObject({status:413});
  });
  it("rejects unsafe URLs and strips extra write fields", () => {
    expect(safeUrl.safeParse("javascript:alert(1)").success).toBe(false);
    expect(safeUrl.safeParse("https://example.com").success).toBe(true);
    expect(contactSchema.safeParse({ ...value, email: "bad" }).success).toBe(
      false,
    );
    expect(
      portfolioSchema.parse({
        title: "X",
        category: "Website",
        description: "X",
        image_url: "",
        project_url: "",
        is_published: false,
        created_at: "fake",
      }),
    ).not.toHaveProperty("created_at");
  });
  it("fails closed when shared limiter is missing", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    await expect(
      rateLimit(new Request("http://localhost:3000"), "contact"),
    ).rejects.toMatchObject({ status: 503 });
  });
  it("rejects the sixth request through the shared limiter", async () => {
    mocks.limit.mockResolvedValue({ success: false });
    await expect(
      rateLimit(new Request("http://localhost:3000"), "contact"),
    ).rejects.toMatchObject({ status: 429 });
  });
  it("validates PDF MIME, filename, size and signature", async () => {
    await expect(
      validatePdf(
        new File(["%PDF-1.7 test"], "resume.pdf", { type: "application/pdf" }),
      ),
    ).resolves.toBeInstanceOf(Buffer);
    for (const f of [
      new File(["bad"], "resume.pdf", { type: "application/pdf" }),
      new File(["%PDF-"], "resume.exe", { type: "application/pdf" }),
      new File(["%PDF-"], "resume.pdf", { type: "text/plain" }),
      new File([new Uint8Array(3145729)], "resume.pdf", {
        type: "application/pdf",
      }),
    ])
      await expect(validatePdf(f)).rejects.toMatchObject({ status: 400 });
  });
});
describe("contact submission", () => {
  const request = (body: unknown, origin = "http://localhost:3000") =>
    new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  it("returns success only after a committed insert", async () => {
    mocks.from.mockReturnValue({ insert: mocks.insert });
    expect((await contact(request(value))).status).toBe(200);
    expect(mocks.insert).toHaveBeenCalledOnce();
    mocks.insert.mockResolvedValue({ error: { code: "offline" } });
    expect((await contact(request(value))).status).toBe(503);
  });
  it("accepts honeypot neutrally without writing", async () => {
    expect((await contact(request({ ...value, website: "spam" }))).status).toBe(
      200,
    );
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects cross-origin requests", async () => {
    expect((await contact(request(value, "https://evil.example"))).status).toBe(
      403,
    );
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("handles identical duplicate requests and rejects changed payloads", async () => {
    let stored = "";
    mocks.insert.mockImplementation(async (v) => {
      stored = v.payload_hash;
      return { error: { code: "23505" } };
    });
    mocks.from.mockReturnValue({
      insert: mocks.insert,
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { payload_hash: stored } }),
        }),
      }),
    });
    await expect(saveContact(value)).resolves.toBeUndefined();
    mocks.from.mockReturnValue({
      insert: mocks.insert,
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { payload_hash: "other" } }),
        }),
      }),
    });
    await expect(saveContact(value)).rejects.toMatchObject({ status: 409 });
  });
});
describe("private application persistence", () => {
  function mockRows(open = true) {
    mocks.from.mockImplementation((table) => ({
      select: () => ({
        eq: () =>
          table === "job_applications"
            ? { maybeSingle: async () => ({ data: null }) }
            : {
                eq: () => ({
                  maybeSingle: async () => ({
                    data: open ? { id: key } : null,
                    error: null,
                  }),
                }),
              },
      }),
    }));
  }
  const file = () =>
    new File(["%PDF-1.7 test"], "resume.pdf", { type: "application/pdf" });
  it("rejects closed roles before upload", async () => {
    mockRows(false);
    await expect(
      saveApplication(
        key,
        {
          name: "Test",
          email: "test@example.com",
          cover_letter: "",
          idempotency_key: key,
        },
        file(),
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("stores a private randomized path and commits through the locked RPC", async () => {
    mockRows();
    mocks.rpc.mockResolvedValue({ error: null });
    await saveApplication(
      key,
      {
        name: "Test",
        email: "test@example.com",
        cover_letter: "",
        idempotency_key: key,
      },
      file(),
    );
    expect(mocks.upload.mock.calls[0][0]).toMatch(
      new RegExp(`^${key}/[a-f0-9-]+\\.pdf$`),
    );
    expect(mocks.rpc).toHaveBeenCalledWith(
      "submit_job_application",
      expect.objectContaining({ p_job_id: key }),
    );
  });
  it("cleans uploaded objects if the insert fails", async () => {
    mockRows();
    mocks.rpc.mockResolvedValue({
      error: { code: "failed", message: "insert failed" },
    });
    await expect(
      saveApplication(
        key,
        {
          name: "Test",
          email: "test@example.com",
          cover_letter: "",
          idempotency_key: key,
        },
        file(),
      ),
    ).rejects.toBeTruthy();
    expect(mocks.remove).toHaveBeenCalledWith([mocks.upload.mock.calls[0][0]]);
  });
});
