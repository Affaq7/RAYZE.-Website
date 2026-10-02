import assert from "node:assert/strict";
const base = process.argv[2] || process.env.SMOKE_URL || "http://localhost:3000";
for (const route of [
  "/",
  "/services",
  "/work",
  "/about",
  "/careers",
  "/contact",
  "/privacy",
  "/admin/login",
]) {
  const r = await fetch(base + route);
  assert.equal(r.status, 200, route);
  const html = await r.text();
  assert.match(html, /<title>/);
  assert.match(html, /name="description"/);
  assert.ok(
    r.headers.get("content-security-policy")?.includes("nonce-"),
    route + " CSP",
  );
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  if (route.startsWith("/admin")) assert.match(html, /noindex/);
  console.log("PASS", route);
}
for (const route of [
  "/admin",
  "/admin/portfolio",
  "/admin/reviews",
  "/admin/careers",
  "/admin/applications",
  "/admin/contacts",
]) {
  const r = await fetch(base + route, { redirect: "manual" });
  assert.equal(r.status, 307, route);
  assert.ok(r.headers.get("location")?.includes("/admin/login"));
  console.log("PASS denied", route);
}
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.ok(!sitemap.includes("/admin"));
const robots = await (await fetch(base + "/robots.txt")).text();
assert.match(robots, /Disallow: \/admin/);
const missing = await fetch(base + "/careers/not-a-uuid");
if(missing.status!==404){assert.equal(missing.status,200);const html=await missing.text();assert.match(html,/A DIFFERENT/);assert.match(html,/noindex/);}
const payload = {
  name: "Local smoke test",
  email: "test@example.com",
  company: "",
  service: "Website",
  message: "Local verification",
  website: "",
  idempotency_key: crypto.randomUUID(),
};
const post = async (body, origin = base) =>
  fetch(base + "/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify(body),
  });
assert.equal((await post(payload, "https://invalid.example")).status, 403);
assert.equal((await post({ ...payload, website: "bot" })).status, 200);
assert.equal((await post({ ...payload, email: "invalid" })).status, 400);
assert.equal(
  (await post(payload)).status,
  503,
  "Unconfigured legitimate submission must not claim success",
);
assert.equal((await fetch(base + "/api/admin/contacts")).status, 503);
console.log(
  "PASS metadata, sitemap, robots, not-found, origin, honeypot, validation and unconfigured failures",
);
