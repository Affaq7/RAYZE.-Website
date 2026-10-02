# RAYZE

One Next.js 16 App Router application for marketing, private administration and same-origin APIs. TypeScript, Tailwind, GSAP, Supabase Auth/Postgres/Storage and Upstash Redis. Node 22 LTS. Original logos are retained in `logos/`.

## Run locally

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows, copy `.env.example` to `.env.local` using Explorer or `Copy-Item`. Open http://localhost:3000. The unconfigured site shows useful empty project/job states; legitimate forms return an unavailable error rather than pretending to persist anything. No fictional database records are seeded. At the owner's request, the homepage shows one clearly labeled illustrative demo review when no published reviews exist. Set `SHOW_DEMO_REVIEW=false` to hide it before launch; real published reviews automatically replace it.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Environment

Set every key from `.env.example` in `.env.local` and in the appropriate Vercel environments. Never commit real values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Exact origin, including scheme; local default is `http://localhost:3000`. Used for same-origin protection and metadata. Set the exact preview domain for each deployed preview. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase HTTPS project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supported publishable key. A legacy anon key may be placed here; the app consistently uses this variable name. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged data/storage key. Never use a public-prefixed variable. |
| `ADMIN_USER_IDS` | Comma-separated Supabase Auth user UUIDs. Missing or empty means deny all admin access. |
| `SUPABASE_PORTFOLIO_BUCKET` | Existing public media bucket name. Example value `portfolio` is a placeholder. |
| `SUPABASE_RESUME_BUCKET` | Existing private resume bucket name. Example value `resumes` is a placeholder. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Durable shared rate limiter. Forms and login fail closed if unavailable. |

Production IPs use Vercel's platform-managed `x-vercel-forwarded-for`; generic client-supplied forwarded headers are ignored. Local requests share a development limiter identity. Contact and application endpoints each permit 5 requests/hour/IP. Login has a separate limiter. A honeypot returns neutral success without a data write. Idempotency UUIDs and payload hashes prevent duplicate inserts and reject a reused key with different data.

## Database setup and preservation

No existing source schema or credentials were supplied. The new schema retains the five requested business table names and the required `project_url`, `avatar_url` and `resume_path` fields. It must not be assumed identical to an unseen live schema.

**New empty development project:** review and apply `supabase/migrations/0001_new_database.sql`, followed by `0002_atomic_application.sql`, using Supabase's SQL editor or migration CLI. The baseline creates five tables, deny-all browser RLS, server grants and indexes. The RPC locks and rechecks an open role while inserting an application.

**Existing project:** back up first, inspect its columns, enum types, relationships, existing policies and migration history. Do not replay `0001`, reset the database, or delete legacy migrations. Baseline the existing history; write a new incremental migration matching its actual schema. Review any needed additions for `idempotency_key`, `payload_hash`, `status` and `notes`, and adapt explicit selectors/validators to real retained fields. Apply the application RPC only after that comparison. Test on a development copy before production. No SQL has been applied to a live database by this implementation.

There is no runtime direct Postgres connection or ORM. The server uses Supabase's HTTPS data API. Migration tooling may separately require CLI access or database credentials.

## Storage

Create or retain the public portfolio bucket and private resume bucket, using the exact environment names. Resume bucket must have **Public disabled**, PDF MIME restriction and a 3 MB upload limit. Do not create anon/authenticated read, write or list policies for resumes. Retain Storage RLS and review existing policies for both buckets. Service-role access occurs only on the server after input checks or verified admin authorization. Portfolio browsing is public; browser uploads are denied.

Admin image uploads accept JPEG/PNG/WebP up to 3 MB, decode and re-encode them as WebP, constrain decoded pixels, and use random object names. PDF applications validate MIME, extension, size and `%PDF-` signature and use random paths. The signature check is not malware scanning. If insertion fails, the uploaded resume is removed. If storage cleanup itself fails, the server logs a generic operational message; audit orphan objects against stored `resume_path` values periodically. Deleting an application also removes its resume. Closing a role preserves applications; roles with applications cannot be deleted due to the foreign key.

Authorized admins receive a fresh five-minute download URL with attachment disposition. URLs are not stored in the business tables and API responses are private/no-store. Keep operational logs and storage audits free of resume content and contact data.

Vercel currently documents a 4.5 MB request/response body limit: https://vercel.com/docs/functions/limitations. The 3 MiB resume cap plus a 64 KB multipart envelope remains below it. Handlers enforce the envelope while streaming the request, even without content-length. Recheck the deployed plan/runtime limits and test a near-limit PDF after deployment. Larger uploads require a separately designed signed upload/finalization flow.

## Admin provisioning

Disable public sign-ups in Supabase Auth. Create or invite administrator accounts through the Supabase dashboard; place their immutable UUIDs in `ADMIN_USER_IDS`. No registration route exists. Configure Auth Site URL and exact permitted redirect domains for the actual local, preview and production domains, with no broad production wildcard. The app uses cookie sessions, verified `getUser()` identity, the allowlist, proxy session refresh and logout.

Open `/admin/login`. Manage projects, reviews, open roles, private applications and enquiries. Each admin read, mutation, upload and resume download checks authorization independently. Editors use explicit write schemas; records paginate in batches of 50. Publication/open toggles control public visibility. Admin routes have noindex metadata and are excluded from sitemap/robots indexing rules.

## Brand assets and design tools

The supplied transparent `mark-red.png` is used without color filters alongside separate `RAYZE.` text. Favicons, Apple icon and social preview derive from this original; run `node scripts/assets.mjs` to regenerate them. Inter is locally hosted under its included OFL license and loaded with `next/font/local`, so builds do not need Google Fonts access.

**Delight files and commercial license were not supplied.** Headings temporarily use Inter 900/800/700; this is not Delight. Before public launch, provide licensed Delight Black, ExtraBold and Bold files, declare them through `next/font/local`, and set the heading font variable to those weights. Do not obtain these from an unverified free-font source.

Impeccable was installed using its current official project-scoped Codex installer: `npx impeccable install --providers=codex --scope=project`. Skills/engine are in `.agents/skills/impeccable`; the hook manifest is `.codex/hooks.json`. Product/design context is documented. Open `/hooks` in Codex and approve the project hook, then reload the harness as instructed by the installer. Installation does not establish hook trust automatically. Brand decisions in AGENTS.md take precedence over generic design guidance.

Motion is progressive: content remains visible without JavaScript. GSAP matchMedia scopes/reverts animations on navigation; reduced motion disables continuous loops, parallax and scrubbing. The homepage has a visible pause control. Intersection and page-visibility observers pause loops offscreen/in the background.

## Vercel deployment

1. Push this root application to your repository and import it into one Vercel project with the Next.js framework preset.
2. Choose Node 22, repository root `.`, install `npm ci`, build `npm run build`, and Vercel's default output directory. Do not enable static export.
3. Add the environment values above separately for Development, Preview and Production. Prefer a development Supabase project for previews. Set each preview's exact `NEXT_PUBLIC_SITE_URL`; redeploy after changes.
4. Complete the reviewed database and Storage setup, disable sign-ups, provision the admin allowlist, and configure exact Auth domains.
5. Deploy and verify public routes, login/session refresh/logout, publish/unpublish, all CRUD, shared limits across requests, successful/failed/duplicate submissions, private download expiry and a near-limit upload.

No Vercel account/project connection or deployment credentials were supplied; no public deployment URL is claimed. The optional legacy Google Sheets sync remains disabled and unimplemented; database persistence does not depend on it.

## Verification boundaries

Focused tests use mocked Supabase/Redis boundaries to cover verified/invalid/expired/non-admin identity, direct endpoint denial, origin checks, input/URL validation, rate-limit failure and exhaustion, honeypots, contact success/failure/idempotency, PDF rejection, closed roles, randomized private paths and upload cleanup. These are not proof of live Supabase/Redis connectivity, SQL execution, Storage policies, or Vercel deployment. Those checks require configured development services. See `VERIFICATION.md` for the checks actually completed in this workspace.
