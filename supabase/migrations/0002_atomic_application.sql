-- Compatible only after reviewing the baseline column types against the target schema.
create or replace function public.submit_job_application(p_job_id uuid,p_name text,p_email text,p_cover_letter text,p_resume_path text,p_idempotency_key uuid,p_payload_hash text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
 perform id from public.job_postings where id=p_job_id and is_open=true for share;
 if not found then raise exception 'ROLE_CLOSED'; end if;
 insert into public.job_applications(job_id,name,email,cover_letter,resume_path,idempotency_key,payload_hash) values(p_job_id,p_name,p_email,p_cover_letter,p_resume_path,p_idempotency_key,p_payload_hash);
end; $$;
revoke all on function public.submit_job_application(uuid,text,text,text,text,uuid,text) from public,anon,authenticated;
grant execute on function public.submit_job_application(uuid,text,text,text,text,uuid,text) to service_role;
