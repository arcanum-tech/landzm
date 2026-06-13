-- LandZM: Service enquiries (conveyancing + title verification referrals)
-- Run this in Supabase SQL editor

create table if not exists service_enquiries (
  id uuid primary key default gen_random_uuid(),
  service_type text not null check (service_type in ('conveyancing', 'title_verification')),
  name text not null,
  phone text not null,
  email text,
  notes text,
  extra_data jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_enquiries_status_idx on service_enquiries(status);
create index if not exists service_enquiries_created_idx on service_enquiries(created_at desc);

-- RLS: only service role can read/write
alter table service_enquiries enable row level security;

-- Allow insert from anon (form submissions)
create policy "Allow public insert" on service_enquiries
  for insert with check (true);

-- Only service role can read (admin use)
create policy "Service role read" on service_enquiries
  for select using (auth.role() = 'service_role');
