create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text,
  interest text not null default 'General Inquiry',
  message text not null check (char_length(trim(message)) > 0),
  user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

comment on column public.contact_messages.user_id is 'Logged-in user id if the sender was authenticated; null for guest messages.';

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

create index if not exists idx_contact_messages_user_id
  on public.contact_messages (user_id);

alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages"
on public.contact_messages
for insert
with check (true);

create policy "Authenticated users can read contact messages"
on public.contact_messages
for select
using (auth.role() = 'authenticated');

create policy "Authenticated users can update contact messages"
on public.contact_messages
for update
using (auth.role() = 'authenticated');
