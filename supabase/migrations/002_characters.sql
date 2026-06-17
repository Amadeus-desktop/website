-- Characters table
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete set null,
  name text not null,
  avatar_url text,
  personality text not null default '',
  backstory text not null default '',
  greeting text not null default '안녕, 만나서 반가워!',
  gender text,
  is_public boolean not null default true,
  is_official boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "Anyone can view public or official characters"
  on public.characters for select
  using (is_public = true or is_official = true or creator_id = auth.uid());

create policy "Users can create characters"
  on public.characters for insert
  with check (auth.uid() = creator_id);

create policy "Users can update own characters"
  on public.characters for update
  using (auth.uid() = creator_id);

create policy "Users can delete own characters"
  on public.characters for delete
  using (auth.uid() = creator_id);
