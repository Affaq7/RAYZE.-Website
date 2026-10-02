-- NEW databases ONLY. Existing installations must be baselined and diffed first.
begin;
create table public.portfolio (id uuid primary key default gen_random_uuid(), title text not null, category text not null, description text not null, image_url text not null default '', project_url text not null default '', is_published boolean not null default false, created_at timestamptz not null default now());
create table public.reviews (id uuid primary key default gen_random_uuid(), name text not null, role text not null default '', quote text not null, avatar_url text not null default '', is_published boolean not null default false, created_at timestamptz not null default now());
create table public.job_postings (id uuid primary key default gen_random_uuid(), title text not null, location text not null, employment_type text not null, description text not null, is_open boolean not null default false, created_at timestamptz not null default now());
create table public.job_applications (id uuid primary key default gen_random_uuid(), job_id uuid not null references public.job_postings(id) on delete restrict, name text not null, email text not null, cover_letter text not null default '', resume_path text not null, status text not null default 'new' check(status in ('new','reviewed','shortlisted','closed')), notes text not null default '', idempotency_key uuid not null unique, payload_hash text not null, created_at timestamptz not null default now());
create table public.contact_submissions (id uuid primary key default gen_random_uuid(), name text not null, email text not null, company text not null default '', service text not null, message text not null, status text not null default 'new' check(status in ('new','in_progress','closed')), notes text not null default '', idempotency_key uuid not null unique, payload_hash text not null, created_at timestamptz not null default now());
alter table public.portfolio enable row level security;
alter table public.reviews enable row level security;
alter table public.job_postings enable row level security;
alter table public.job_applications enable row level security;
alter table public.contact_submissions enable row level security;
revoke all on public.portfolio,public.reviews,public.job_postings,public.job_applications,public.contact_submissions from anon,authenticated;
grant all on public.portfolio,public.reviews,public.job_postings,public.job_applications,public.contact_submissions to service_role;
create index portfolio_published on public.portfolio(is_published,created_at desc);
create index jobs_open on public.job_postings(is_open,created_at desc);
create index applications_job on public.job_applications(job_id);
commit;
