# 🛠️ Supabase Lentelių Sukūrimo SQL

Kadangi jūsų sistemoje dar nėra **Tinklaraščio** ir **Atsiliepimų** lentelių, nukopijuokite šį kodą į savo **Supabase SQL Editor** skiltį ir spauskite **„Run“**.

---

### 1. 📝 Tinklaraščio Lentelė (`tinklarastis_irasai`)
```sql
create table public.tinklarastis_irasai (
  id uuid default gen_random_uuid() primary key,
  pavadinimas text not null,
  slug text unique not null,
  turinys text,
  kategorija text,
  nuotrauka_url text,
  perziuros integer default 0,
  created_at timestamp with time zone default now()
);

-- Įgalinti RLS (Saugumas)
alter table public.tinklarastis_irasai enable row level security;
create policy "Visi gali skaityti" on public.tinklarastis_irasai for select using (true);
```

---

### 2. ⭐ Atsiliepimų Lentelė (`atsiliepimai`)
```sql
create table public.atsiliepimai (
  id uuid default gen_random_uuid() primary key,
  vardas text not null,
  komentaras text not null,
  reitingas integer not null check (reitingas >= 1 and reitingas <= 5),
  patvirtinta boolean default false,
  created_at timestamp with time zone default now()
);

-- Įgalinti RLS (Saugumas)
alter table public.atsiliepimai enable row level security;
create policy "Visi gali skaityti" on public.atsiliepimai for select using (true);
create policy "Visi gali rasyti" on public.atsiliepimai for insert with check (true);
```

---

#### 💡 Ką daryti dabar?
1. Nukopijuokite kodą.
2. Įklijuokite į savo Supabase valdymo skydelį.
3. Praneškite man, kad lentelės sukurtos, ir aš iškart sujungsiu pilną CRUD valdymo skydelyje!
