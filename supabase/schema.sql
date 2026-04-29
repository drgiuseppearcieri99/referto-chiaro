create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  free_report_used boolean not null default false,
  plan text not null default 'free',
  credits integer not null default 0,
  lemon_customer_id text,
  lemon_subscription_id text,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  pdf_path text,
  status text not null default 'pending',
  traffic_light text,
  extracted_values jsonb,
  ai_summary text,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  type text,
  amount integer,
  lemon_order_id text,
  created_at timestamptz not null default now()
);

-- Crea un bucket privato chiamato "reports" da Supabase Dashboard > Storage.
-- Consiglio: non renderlo pubblico e cancella i PDF dopo un periodo definito nella privacy policy.
