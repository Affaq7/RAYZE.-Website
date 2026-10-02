# AGENT.md — RAYZE

## Purpose and instruction loading

Build and maintain RAYZE as a complete, working Next.js website deployed to Vercel. This document replaces the legacy CLAUDE.md architecture and is the implementation specification, not a claim that the implementation already exists.

Codex automatically discovers `AGENTS.md` (plural). If this file is supplied as `AGENT.md`, explicitly read it at the start of the task. For automatic loading, rename it to `AGENTS.md` in the repository root; preserve any unrelated existing project instructions when merging.

## Brand and scope

RAYZE is a media marketing agency. Tagline: **Rise with RAYZE.**

Preserve these six public services:
1. Social Media Management
2. Logo Design
3. Brand Design
4. Video Editing & Animation
5. Website
6. Automations

Deliver the public marketing website and authenticated admin area in one application. Preserve existing content, records, media, publishing rules, and functional features while redesigning the presentation. Do not invent client relationships, testimonials, awards, team biographies, or performance numbers.

## Inspect before implementing

Inspect the actual repository, assets, package files, environment example, schema, and existing security instructions first. The legacy document describes FastAPI plus static HTML, while the owner also describes React: the checked-out files determine the migration source.

If the project contains only this brief and `logos/`, scaffold the complete application at the project root. Do not pretend legacy code, fonts, credentials, or a Supabase schema are present. If legacy code exists, migrate deliberately and remove superseded runtime dependencies only after replacement functionality is verified. Preserve unrelated work and original assets. Never reset or recreate the live database to simplify the migration.

## Target stack: one application, one deployment

- Next.js App Router with React and strict TypeScript. Select current stable, mutually compatible releases, pin dependencies through the lockfile, and use a supported Node.js LTS version compatible with Vercel.
- One root `package.json`, one development server, one Vercel project. No separate FastAPI service, React/Vite app, static admin deployment, or frontend/backend workspace split.
- React Server Components for pages and data reads by default; small Client Components for forms, menus, filters, and motion.
- Next.js Route Handlers for form submissions and admin mutations. Shared server-only service functions for business logic; Server Components call these functions directly rather than fetching their own API over HTTP.
- Tailwind CSS plus shared CSS variables for the exact brand tokens. Custom components rather than a visible off-the-shelf template.
- Supabase Postgres, Auth, and Storage remain the managed data layer. Use `@supabase/supabase-js` and `@supabase/ssr`. No additional ORM or Python runtime is required.
- Zod for server-side validation and shared input schemas.
- GSAP with ScrollTrigger for coordinated scroll sequences; CSS transforms/keyframes for simple hover effects and continuous loops. Avoid multiple overlapping animation frameworks.
- Durable Redis-backed rate limiting (for example Upstash) for public submissions. An in-memory counter is not production rate limiting on Vercel.
- Impeccable is a development design skill/tool, not a website component library or client-side runtime dependency.

## Target structure

Use these paths as the target structure, creating only supporting files that are needed:

```text
AGENT.md                         # or AGENTS.md for automatic Codex discovery
package.json
package-lock.json
next.config.ts
tsconfig.json
.env.example
README.md
logos/                           # supplied originals; retain these
public/logos/                    # selected web-ready copies
public/fonts/                    # available, licensed local font files
public/images/
src/app/layout.tsx
src/app/globals.css
src/app/(marketing)/page.tsx
src/app/(marketing)/services/page.tsx
src/app/(marketing)/work/page.tsx
src/app/(marketing)/about/page.tsx
src/app/(marketing)/careers/page.tsx
src/app/(marketing)/careers/[id]/page.tsx
src/app/(marketing)/contact/page.tsx
src/app/admin/login/page.tsx
src/app/admin/(protected)/layout.tsx
src/app/admin/(protected)/page.tsx
src/app/admin/(protected)/portfolio/page.tsx
src/app/admin/(protected)/reviews/page.tsx
src/app/admin/(protected)/careers/page.tsx
src/app/admin/(protected)/applications/page.tsx
src/app/admin/(protected)/contacts/page.tsx
src/app/api/contact/route.ts
src/app/api/careers/[id]/apply/route.ts
src/app/api/admin/               # protected CRUD and signed-download routes
src/app/robots.ts
src/app/sitemap.ts
src/components/layout/
src/components/sections/
src/components/ui/
src/components/motion/
src/lib/supabase/                # browser, request-scoped server, privileged client
src/lib/auth/                    # verified identity and requireAdmin()
src/lib/services/                # portfolio, reviews, careers, contacts, storage
src/lib/validation/
src/lib/rate-limit.ts
src/lib/env.ts
src/types/
supabase/migrations/             # reviewed incremental SQL
```

Use the installed Next.js version's supported request proxy/middleware convention for Supabase session refresh. Keep login outside the protected admin layout to avoid redirect loops.

## Brand / theme system — preserve

| Token | Value / rule |
| --- | --- |
| Background | `#0a0a0a` |
| Raised surface | `#141414` |
| Accent | `#e8241a`, the only UI accent |
| Primary text | White |
| Secondary text | `#9a9a9a` |
| Borders | `#262626` |
| Shape | Sharp corners, no rounded UI |
| H1 | Delight Black, 900 |
| H2 | Delight ExtraBold, 800 |
| H3 | Delight Bold, 700 |
| Body | Inter |

Maintain uppercase, heavy, blocky headings. Preserve dash-prefixed uppercase overlines, oversized section numbers, large-number stat treatments where verified data exists, and full-bleed red CTA sections. Keep these patterns intentional rather than repeating every pattern in every section.

“Non-AI fonts and layout” means deliberate typography, art direction, spacing, and composition. Because the owner explicitly requires the existing theme, keep Delight and Inter rather than silently replacing them with a new font pairing. Avoid generic SaaS styling, pill controls, glowing gradients, glassmorphism, identical card grids, and arbitrary decorative blobs. The UI palette stays restricted; genuine portfolio photography/video can retain its original colors.

Load available Delight weights with `next/font/local`, mapping 900/800/700 correctly. Use `next/font` for Inter. The legacy document says Delight's commercial license is unverified: do not assume that availability means permission. If the files or license are unavailable, use an explicit temporary fallback, report it, and obtain a licensed choice before public launch. Do not fetch fonts from random free-font sites or claim a fallback is Delight.

Check actual text contrast. Small white text on the red accent must not be assumed accessible; adjust text color/size within the palette without changing the accent token.

## Logos

The owner supplies a root `logos/` directory. Inspect the actual files and choose the appropriate existing variants. Copy web assets into `public/logos/` and reference `/logos/...`; preserve originals.

The preferred nav/footer treatment is a transparent solid-red angular R mark with separate CSS text `RAYZE.`. The legacy name `mark-red.png` is a hint, not proof the asset exists. Use the supplied equivalent, keep its aspect ratio, and avoid filters that alter the mark. Do not draw a substitute logo, add a wordmark twice, or use a social-icon square inline. `rayze-20.png` and `rayze-21.png`, if present, are social/app-icon assets only. Generate favicon sizes and an Apple touch icon from the approved mark. Use decorative alt text when adjacent brand text would duplicate the accessible name.

## Impeccable and visual direction

Before substantial UI work, inspect https://impeccable.style/ and its official installation guidance. At the time this brief was prepared, the documented project installer was:

```bash
npx impeccable install
```

Choose the project-scoped Codex integration and inspect what it installs. Follow the current supported instructions if the installer changes. Read and apply the installed design guidance. Initialize its project context when available; preserve this document's brand decisions. Respect any explicit hook-trust or restart requirements rather than pretending hooks are active. If installation is blocked, report the exact blocker and continue implementation using the accessible design guidance; do not claim installation succeeded.

Review https://www.nike.com/, https://www.apple.com/, and https://penta-ai.tech/ for inspiration. Study composition and interaction, not just page text. Translate the owner's desired direction into original RAYZE work: confident campaign-scale typography, strong image/video framing, disciplined whitespace, controlled reveal pacing, and clear service conversion paths. Do not copy source code, slogans, proprietary assets, or another brand's identity. If a reference cannot be reached, say so and use the available references without inventing its appearance.

Use an editorial layout with varied section proportions, asymmetry where useful, fine dividers, deliberate line breaks, and generous spacing. Build a distinctive homepage: typographic hero and genuine creative media; selected work; six service treatments; a concise process section; real reviews if available; bold red contact CTA. Avoid filling the page with repeated equal-sized cards. Every CTA must have a working destination.

## Motion specification

- Hero: a brief heading/media entrance that never blocks access to content.
- Scroll: staggered section reveals, restrained image parallax, and one purposeful ScrollTrigger sequence for work or services. Pinned sections are optional and must not trap scrolling.
- Continuous motion: a slow seamless service-text marquee and, where assets support it, a second subtle decorative loop using the R mark or project imagery. Do not fabricate a client-logo wall.
- Hover/focus: crisp underline, arrow, border, or image-scale responses; provide keyboard equivalents.
- Keep essential content visible without JavaScript. Initialize animation progressively, scope GSAP per component, and clean up timelines, ScrollTriggers, listeners, and observers on unmount.
- Respect `prefers-reduced-motion`: disable parallax, scrubbing, and continuous loops and show static readable content. Pause offscreen/background loops; provide a visible pause control for continuous moving content. Hide duplicated marquee copies from assistive technology.
- Use transforms and opacity; avoid layout thrashing, page-wide client rendering, scroll hijacking, autoplay audio, and motion that impairs forms. Simplify sequences on small screens. Size media in advance to prevent layout shifts.

## Pages and functional behavior

- Home: complete brand narrative, real work previews, services, and direct contact paths.
- Services: all six services with specific deliverables and enquiry links.
- Work: published projects only, useful filtering, and valid project links. Preserve `portfolio.project_url`; validate external URLs and prevent unsafe schemes.
- About: truthful agency introduction and supplied team information only.
- Careers: open roles only, job details, and working applications with private resume handling. Recheck that a role is open on submission.
- Contact: working validated lead form, accessible pending/success/error states, and supplied contact details. Never display a fabricated email address or fake success for failed legitimate submissions.
- Admin: Supabase login, session refresh/logout, portfolio and review CRUD, publishing controls, and complete management of careers, applications, and contact submissions. The legacy admin supported only portfolio/reviews; the remaining screens are explicit completion work.
- Provide helpful loading, empty, error, and not-found states. Do not expose admin navigation in the marketing site. Mark admin pages noindex and omit them from the sitemap; these are discovery controls, not authorization.

## Data and migrations

Retain the five existing business tables: `portfolio`, `reviews`, `job_postings`, `job_applications`, and `contact_submissions`. Preserve existing columns, IDs, timestamps, relationships, enums, `portfolio.project_url`, `reviews.avatar_url`, and `job_applications.resume_path`.

The legacy migration history is `0001` schema, `0002` deny-all RLS for anon/authenticated, and `0003` project/avatar URLs. Inspect actual schema before making changes. Baseline existing deployments without replaying table creation; write new incremental SQL under `supabase/migrations/`. For a truly new database, provide a complete initial migration. Do not run Alembic and Supabase migrations as competing schema authorities. Retain legacy migration history as reference where present. Review and test SQL against a development database before live application.

Use Supabase's HTTPS data API for the simplified server data layer; `SUPABASE_DB_URL` and the legacy asyncpg session-pooler configuration are not runtime requirements. Migration tooling may need its own documented connection credentials.

## Security and server boundaries

- Preserve deny-all table RLS for browser `anon`/`authenticated` access. Put the privileged Supabase client in an explicitly server-only module. It bypasses RLS, so every server data operation needs its own publication filtering or verified admin authorization.
- Public pages expose only published portfolio/reviews and open jobs, with explicit safe field selection. Never serialize submissions, private metadata, or unpublished rows into HTML or client props.
- Use Supabase SSR cookie-based sessions and the official supported refresh pattern, not hand-written localStorage token handling. Verify identity server-side using the supported Supabase verification methods; never trust decoded JWT data or an unverified client session alone. Do not introduce a fixed shared JWT secret.
- Require both verified identity and an explicit server-controlled admin UUID allowlist (`ADMIN_USER_IDS`). Deny access when that allowlist is missing/empty. Do not retain the legacy rule that every valid Supabase user is an admin. Disable public sign-ups; there is no public registration page. Never use user-editable metadata for authorization.
- Run `requireAdmin()` inside every admin read, mutation, upload authorization, and signed-download operation. A protected layout or proxy redirect alone is insufficient. Do not cache authenticated responses in a shared public cache.
- Validate all server inputs, field lengths, IDs, and URLs. Use explicit write fields to prevent mass assignment. Protect cookie-authenticated mutations with same-origin checks and appropriate CSRF defenses. Configure secure production cookies, security headers, and a tested CSP compatible with actual fonts/media/scripts.
- Contact and application submissions retain the legacy 5 requests/hour/IP limit per submission endpoint plus a honeypot. Enforce limits with an atomic shared store and trusted platform IP handling. Filled honeypots return neutral success without database writes. If the limiter is unavailable, fail closed with a retryable response in production.
- Never commit secrets or put privileged keys in `NEXT_PUBLIC_*`. Redact tokens, resume contents, and contact details from logs. Return safe user-facing errors.

## Storage and submissions

Portfolio media belongs in the public Supabase Storage bucket; public URLs can be stored. Resumes belong in a private bucket; store only their object paths. Authorized admins receive fresh 5–10 minute signed download URLs on demand.

For the first implementation, accept PDF resumes up to 3 MB via the application Route Handler. Verify the installed deployment's body limits including multipart overhead; lower the configured cap if necessary. Validate size, MIME, PDF signature, and filenames server-side; generate non-guessable object paths. File signatures are a basic check, not malware scanning. Enforce private access and download disposition. Remove an uploaded object if the associated database insert fails. Validate media uploads separately and never overwrite objects through a user-controlled path. Larger upload support requires scoped signed direct uploads plus server-side finalization checks, not an unbounded serverless request.

Commit a legitimate submission before confirming success. Protect against duplicate clicks/retries using idempotency. The legacy Google Sheets sync is an unconfigured no-op: retain it as optional and disabled by default. Do not report successful sync or make database persistence depend on it. If implemented later, use credentials kept on the server and a durable retry mechanism; do not rely on fire-and-forget work after a serverless response.

## Environment and local workflow

Document validated configuration in `.env.example` with placeholders:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USER_IDS=
SUPABASE_PORTFOLIO_BUCKET=
SUPABASE_RESUME_BUCKET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Use the Supabase project's supported public key type; if it uses a legacy anon key, document the appropriate env name and update all consumers consistently. Bucket names must match the existing project. Runtime secrets belong in `.env.local` and Vercel environment settings. Never print actual values.

Provide working package scripts:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

Use the existing package manager if a lockfile already establishes one. Define lint with the installed ESLint tooling, typecheck with TypeScript, and test with actual focused tests. One dev server serves marketing, admin, and APIs. No Uvicorn, Python HTTP servers, hardcoded API_BASE, or cross-origin configuration is needed for same-origin app requests.

If credentials are missing, continue the UI and implementation with an explicit development-only preview mode or useful empty states. Never fabricate a working production backend, expose seeded fictional testimonials, fake form success, or weaken auth to make a demo appear complete. Report exactly which integrations could not be tested.

## Vercel deployment

Prepare a standard Next.js deployment from the repository root with the Next.js framework preset and a supported Node version. Use Vercel's normal build output, not static export, because auth and submissions need server code. No custom persistent Node server, Docker service, or separate backend hosting is required.

Set environment variables for Development, Preview, and Production deliberately. Configure Supabase Auth's site URL and allowed redirects for the actual domains without broad production wildcards. Avoid sharing live data with previews where a development project is available. Use the Node runtime for handlers that need Node APIs. Do not persist application data or uploads on the function filesystem. Account for deployment duration/body-size limits and use durable services for rate limits and longer jobs.

Document setup, database migrations, bucket policies, admin provisioning, environment variables, and the exact deployment steps in README. Deploy if the user has requested it and the connected Vercel project/access are available; otherwise finish the deployable implementation and report the specific account/configuration step remaining. Never claim a deployment without a confirmed URL and verification.

## Acceptance checks

1. One root Next.js app builds and runs with no legacy backend dependency.
2. All public routes and admin workflows exist; links, filters, menus, and forms function. Public filters cannot expose unpublished data.
3. Test successful and failed submissions, honeypot behavior, shared rate limiting, file rejection/cleanup, and duplicate-request handling.
4. Test expired/invalid sessions, non-admin users, direct admin endpoint access, and private-resume access. Verify authorization independently of the UI.
5. Run lint, typecheck, focused tests, and production build; fix failures rather than suppressing them.
6. Inspect real rendered pages at mobile, tablet, and desktop widths. Check keyboard navigation, focus, contrast, reduced motion, text overflow, image layout, and animation cleanup. Capture screenshots and refine the design using installed Impeccable review guidance.
7. Verify title/description metadata, social preview, sitemap, robots, optimized assets, and no public admin/private-data indexing.
8. End with a short summary of implemented behavior, checks actually run, setup steps, and concrete blockers. Clearly distinguish previewed UI from verified live integrations.

## Reference documentation

Consult current official docs when implementing version-sensitive details:
- https://nextjs.org/docs/app
- https://supabase.com/docs/guides/auth/server-side/nextjs
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://impeccable.style/
- https://github.com/pbakaus/impeccable
- https://developers.openai.com/codex/guides/agents-md/
