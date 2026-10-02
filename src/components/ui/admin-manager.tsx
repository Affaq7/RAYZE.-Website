"use client";
import { useState } from "react";
import { services, type Resource } from "@/lib/validation";
type Row = Record<string, string | boolean> & { id: string };
const fields: Record<Resource, string[]> = {
  portfolio: [
    "title",
    "category",
    "description",
    "image_url",
    "project_url",
    "is_published",
  ],
  reviews: ["name", "role", "quote", "avatar_url", "is_published"],
  careers: ["title", "location", "employment_type", "description", "is_open"],
  applications: ["status", "notes"],
  contacts: ["status", "notes"],
};
const labels: Record<string, string> = {
  image_url: "Image URL",
  project_url: "Project URL",
  avatar_url: "Avatar URL",
  is_published: "Published",
  is_open: "Open for applications",
  employment_type: "Employment type",
};
export function AdminManager({
  resource,
  initial,
}: {
  resource: Resource;
  initial: Row[];
}) {
  const [rows, setRows] = useState(initial);
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const content = ["portfolio", "reviews", "careers"].includes(resource);
  async function refresh(page = offset) {
    const r = await fetch(`/api/admin/${resource}?offset=${page}`);
    const data = await r.json();
    if (!r.ok) throw Error(data.error);
    setRows(data);
    setOffset(page);
  }
  async function remove(key: string) {
    setPending(true);
    try {
      const r = await fetch(`/api/admin/${resource}/${key}`, {
        method: "DELETE",
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      await refresh();
      setDeleting(null);
      setMessage("Record deleted.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <div className="admin-toolbar">
        <label>
          Search records
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title or email"
          />
        </label>
        {content && (
          <button
            className="button"
            onClick={() => {
              setEditing({});
              setMessage("");
            }}
          >
            Add{" "}
            {resource === "careers"
              ? "role"
              : resource === "reviews"
                ? "review"
                : "project"}
          </button>
        )}
      </div>
      <p role="status">{message}</p>
      {editing && (
        <section className="editor" key={editing.id || "new"}>
          <h2>{editing.id ? "Edit record" : "New record"}</h2>
          <form
            className="submission-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setMessage("");
              const form = new FormData(e.currentTarget);
              const value = Object.fromEntries(
                fields[resource].map((f) => [
                  f,
                  f.startsWith("is_")
                    ? form.get(f) === "on"
                    : form.get(f) || "",
                ]),
              );
              try {
                const r = await fetch(
                  `/api/admin/${resource}${editing.id ? `/${editing.id}` : ""}`,
                  {
                    method: editing.id ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(value),
                  },
                );
                const data = await r.json();
                if (!r.ok) throw Error(data.error);
                await refresh();
                setEditing(null);
                setMessage("Saved.");
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Save failed.");
              } finally {
                setPending(false);
              }
            }}
          >
            {fields[resource].map((f) => (
              <label key={`${editing.id || "new"}-${f}`}>
                {labels[f] || f.replaceAll("_", " ")}
                {f.startsWith("is_") ? (
                  <input
                    type="checkbox"
                    name={f}
                    defaultChecked={Boolean(editing[f])}
                  />
                ) : ["category", "employment_type", "status"].includes(f) ? (
                  <select name={f} defaultValue={String(editing[f] || "")}>
                    {(f === "category"
                      ? services
                      : f === "employment_type"
                        ? ["Full-time", "Part-time", "Contract", "Internship"]
                        : resource === "applications"
                          ? ["new", "reviewed", "shortlisted", "closed"]
                          : ["new", "in_progress", "closed"]
                    ).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : ["description", "quote", "notes"].includes(f) ? (
                  <textarea
                    name={f}
                    rows={5}
                    defaultValue={String(editing[f] || "")}
                    required={f !== "notes"}
                    maxLength={f === "description" ? 15000 : 5000}
                  />
                ) : (
                  <input
                    name={f}
                    defaultValue={String(editing[f] || "")}
                    maxLength={f.endsWith("_url") ? 2000 : 160}
                    type={f.endsWith("_url") ? "url" : "text"}
                    required={["title", "name", "location"].includes(f)}
                  />
                )}
              </label>
            ))}
            {content && resource !== "careers" && (
              <label>
                Upload {resource === "reviews" ? "avatar" : "project image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = e.target.form;
                    setPending(true);
                    try {
                      const data = new FormData();
                      data.set("file", file);
                      const r = await fetch("/api/admin/media", {
                        method: "POST",
                        body: data,
                      });
                      const result = await r.json();
                      if (!r.ok) throw Error(result.error);
                      const input = form?.elements.namedItem(
                        resource === "reviews" ? "avatar_url" : "image_url",
                      ) as HTMLInputElement;
                      if (input) input.value = result.url;
                      setMessage("Image uploaded. Save the record to use it.");
                    } catch (e) {
                      setMessage(
                        e instanceof Error ? e.message : "Upload failed.",
                      );
                    } finally {
                      setPending(false);
                    }
                  }}
                />
                <small>JPEG, PNG or WebP · up to 3 MB</small>
              </label>
            )}
            <div className="actions">
              <button className="button" disabled={pending}>
                {pending ? "Saving…" : "Save record"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
      <div className="records">
        {rows
          .filter((r) =>
            JSON.stringify(r).toLowerCase().includes(query.toLowerCase()),
          )
          .map((r) => (
            <article className="record" key={r.id}>
              <div className="record-head">
                <h2>{String(r.title || r.name)}</h2>
                <span>
                  {String(
                    r.status ||
                      (r.is_published
                        ? "Published"
                        : r.is_open
                          ? "Open"
                          : "Draft / closed"),
                  )}
                </span>
              </div>
              <p>
                {String(r.email || r.category || r.role || r.location || "")}
              </p>
              {!content && (
                <>
                  <p className="preserve-lines">
                    {String(r.message || r.cover_letter || "")}
                  </p>
                  <p>
                    {r.company && `Company: ${r.company} · `}
                    {r.service && `Service: ${r.service}`}
                    {r.job_id && `Role ID: ${r.job_id}`}
                  </p>
                  <small>
                    {new Date(String(r.created_at)).toLocaleString()}
                  </small>
                </>
              )}
              <div className="actions">
                <button
                  onClick={() => {
                    setEditing(r);
                    setMessage("");
                  }}
                >
                  {content ? "Edit" : "Update status & notes"}
                </button>
                {resource === "applications" && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `/api/admin/resume/${r.id}`,
                        );
                        const data = await response.json();
                        if (!response.ok) throw Error(data.error);
                        window.location.assign(data.url);
                      } catch (e) {
                        setMessage(
                          e instanceof Error ? e.message : "Download failed.",
                        );
                      }
                    }}
                  >
                    Download resume
                  </button>
                )}
                <button onClick={() => setDeleting(r.id)}>Delete</button>
              </div>
              {deleting === r.id && (
                <div className="delete-confirm">
                  <p>
                    Delete this record permanently?{" "}
                    {resource === "applications" &&
                      "Its resume will also be removed."}
                  </p>
                  <button disabled={pending} onClick={() => remove(r.id)}>
                    Confirm delete
                  </button>
                  <button onClick={() => setDeleting(null)}>Cancel</button>
                </div>
              )}
            </article>
          ))}
        {!rows.length && (
          <div className="empty-state">
            <h2>Nothing here yet.</h2>
            <p>
              {content
                ? "Add your first record. New content is private until you publish or open it."
                : "New submissions will appear here."}
            </p>
          </div>
        )}
      </div>
      <div className="actions">
        <button
          disabled={offset === 0 || pending}
          onClick={async () => {
            try {
              await refresh(Math.max(0, offset - 50));
            } catch {
              setMessage("Unable to load records.");
            }
          }}
        >
          Previous page
        </button>
        <span>Page {Math.floor(offset / 50) + 1}</span>
        <button
          disabled={rows.length < 50 || pending}
          onClick={async () => {
            try {
              await refresh(offset + 50);
            } catch {
              setMessage("Unable to load records.");
            }
          }}
        >
          Next page
        </button>
      </div>
      <p className="form-note">Search filters the current page.</p>
    </>
  );
}
