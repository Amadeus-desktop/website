-- Extended features: chat modes, jam credits, character memory

-- Chat mode on conversations
alter table public.conversations
  add column if not exists chat_mode text not null default 'simple'
  check (chat_mode in ('simple', 'long', 'exciting'));

-- Jam credit balances
create table if not exists public.jam_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance int not null default 20 check (balance >= 0),
  last_daily_claim timestamptz,
  created_at timestamptz not null default now()
);

alter table public.jam_balances enable row level security;

create policy "Users can view own jam balance"
  on public.jam_balances for select
  using (auth.uid() = user_id);

create policy "Users can update own jam balance"
  on public.jam_balances for update
  using (auth.uid() = user_id);

create policy "Users can insert own jam balance"
  on public.jam_balances for insert
  with check (auth.uid() = user_id);

-- Character memories per conversation
create table if not exists public.character_memories (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.character_memories enable row level security;

create policy "Users can view memories in own conversations"
  on public.character_memories for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert memories in own conversations"
  on public.character_memories for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete memories in own conversations"
  on public.character_memories for delete
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create index if not exists idx_character_memories_conversation_id
  on public.character_memories(conversation_id);

-- Auto-create jam balance on signup (update existing trigger function)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );

  insert into public.jam_balances (user_id, balance)
  values (new.id, 20);

  return new;
end;
$$;

-- Backfill jam balances for existing users
insert into public.jam_balances (user_id, balance)
select id, 20 from auth.users
where id not in (select user_id from public.jam_balances)
on conflict do nothing;
