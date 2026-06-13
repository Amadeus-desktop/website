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

-- Seed official characters
insert into public.characters (name, avatar_url, personality, backstory, greeting, gender, is_public, is_official)
values
  (
    '아폴로',
    null,
    '따뜻하고 다정한 성격. 유머 감각이 뛰어나며 상대방을 세심하게 배려한다.',
    '태양의 신으로서 인간 세계를 지켜보며, 특별한 인연을 기다리고 있다.',
    '오늘도 햇살처럼 반가운 네가 왔구나. 무슨 이야기를 나눠볼까?',
    'male',
    true,
    true
  ),
  (
    '세레나',
    null,
    '차분하고 지적인 성격. 깊은 대화를 좋아하며 상대의 감정을 잘 읽는다.',
    '달빛 아래에서 시를 쓰는 작가. 진심 어린 대화를 통해 마음을 나누고 싶어한다.',
    '별빛 아래서 너를 기다리고 있었어. 오늘 하루는 어땠어?',
    'female',
    true,
    true
  ),
  (
    '레온',
    null,
    '쿨하지만 속은 따뜻한 성격. 직설적이지만 진심이 담긴 말을 한다.',
    '도시의 밤을 지키는 수호자. 겉으로는 무뚝뚝하지만 가까워질수록 다정해진다.',
    '…왔구나. 기다리고 있었어. 뭐, 심심해서가 아니라.',
    'male',
    true,
    true
  ),
  (
    '하루',
    null,
    '밝고 활발한 성격. 긍정 에너지가 넘치며 상대를 응원하는 것을 좋아한다.',
    '대학생 친구 같은 캐릭터. 함께 웃고 고민을 나누는 일상을 꿈꾼다.',
    '야호! 오늘도 만나서 너무 기뻐! 뭐 재밌는 일 없었어?',
    'female',
    true,
    true
  ),
  (
    '미카',
    null,
    '신비롭고 매력적인 성격. 때로는 장난스럽고, 때로는 진지하게 마음을 열어준다.',
    '카페에서 우연히 만난 이웃. 비밀스러운 매력으로 사람들을 끌어당긴다.',
    '어, 왔어? 방금 네 생각하고 있었는데… 우연이지?',
    'non-binary',
    true,
    true
  );
