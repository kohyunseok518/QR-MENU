-- QR MENU / first database migration / 2026-10-25
-- Fresh schema only: existing objects cause the transaction to roll back.
-- Admin accounts are managed in Supabase Auth. No public.admins table.
-- Apply Auth settings first: public sign-ups OFF, anonymous sign-ins OFF.
begin;

create schema qr_menu_private;
revoke all on schema qr_menu_private from public;
grant usage on schema qr_menu_private to authenticated, service_role;

-- 공통 코드 사전. 코드 추가는 후속 migration에서 함수를 교체합니다.
-- 원산지 목록은 전체 원재료 목록이 아니며, 실제 메뉴 정보가 아닙니다.
create function qr_menu_private.ingredient_codes()
returns text[] language sql immutable set search_path = ''
as $$
  select array['beef', 'pork', 'chicken', 'rice', 'kimchi_cabbage', 'chili_powder']::text[];
$$;

-- 프로젝트의 표시용 코드 사전이며, 섭취 안전성이나 법정 표시의 완전성을 보장하지 않습니다.
create function qr_menu_private.allergen_codes()
returns text[] language sql immutable set search_path = ''
as $$
  select array[
    'egg', 'milk', 'buckwheat', 'peanut', 'soybean', 'wheat',
    'mackerel', 'crab', 'shrimp', 'pork', 'peach', 'tomato',
    'sulfites', 'walnut', 'chicken', 'beef', 'squid', 'shellfish', 'pine_nut'
  ]::text[];
$$;

create function qr_menu_private.country_codes()
returns text[] language sql immutable set search_path = ''
as $$
  select array['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW']::text[];
$$;

create function qr_menu_private.valid_allergen_codes(p_codes text[])
returns boolean language sql immutable set search_path = ''
as $$
  select p_codes is not null
    and coalesce(array_ndims(p_codes), 1) = 1
    and array_position(p_codes, null) is null
    and p_codes <@ qr_menu_private.allergen_codes()
    and cardinality(p_codes) = (select count(distinct code) from unnest(p_codes) as items(code));
$$;

create function qr_menu_private.valid_origin_info(p_value jsonb)
returns boolean language plpgsql immutable set search_path = ''
as $$
declare
  v_item jsonb;
  v_country jsonb;
  v_ingredient text;
  v_country_code text;
  v_seen_ingredients text[] := array[]::text[];
  v_seen_countries text[];
begin
  if jsonb_typeof(p_value) is distinct from 'array' then
    return false;
  end if;

  for v_item in select value from jsonb_array_elements(p_value) loop
    if jsonb_typeof(v_item) is distinct from 'object' then
      return false;
    end if;
    if (select count(*) from jsonb_object_keys(v_item)) <> 2
      or jsonb_typeof(v_item -> 'ingredient_code') is distinct from 'string'
      or jsonb_typeof(v_item -> 'country_codes') is distinct from 'array' then
      return false;
    end if;

    v_ingredient := v_item ->> 'ingredient_code';
    if not (v_ingredient = any(qr_menu_private.ingredient_codes()))
      or v_ingredient = any(v_seen_ingredients) then
      return false;
    end if;
    v_seen_ingredients := array_append(v_seen_ingredients, v_ingredient);
    if jsonb_array_length(v_item -> 'country_codes') = 0 then
      return false;
    end if;

    v_seen_countries := array[]::text[];
    for v_country in select value from jsonb_array_elements(v_item -> 'country_codes') loop
      if jsonb_typeof(v_country) is distinct from 'string' then
        return false;
      end if;
      v_country_code := v_country #>> '{}';
      if not (v_country_code = any(qr_menu_private.country_codes()))
        or v_country_code = any(v_seen_countries) then
        return false;
      end if;
      v_seen_countries := array_append(v_seen_countries, v_country_code);
    end loop;
  end loop;
  return true;
end;
$$;

create function qr_menu_private.touch_record()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := clock_timestamp();
  new.version := old.version + 1;
  return new;
end;
$$;

-- 보조 함수는 공개 RPC로 노출하지 않습니다. 필요한 검증 함수만 실행을 허용합니다.
revoke all on all functions in schema qr_menu_private from public, anon, authenticated;
grant execute on function qr_menu_private.ingredient_codes(),
  qr_menu_private.allergen_codes(), qr_menu_private.country_codes(),
  qr_menu_private.valid_allergen_codes(text[]), qr_menu_private.valid_origin_info(jsonb)
to authenticated, service_role;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null check (name_ko !~ '^[[:space:]]*$'),
  name_en text not null check (name_en !~ '^[[:space:]]*$'),
  name_zh_hans text not null check (name_zh_hans !~ '^[[:space:]]*$'),
  name_zh_hant text not null check (name_zh_hant !~ '^[[:space:]]*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name_ko text not null check (name_ko !~ '^[[:space:]]*$'),
  name_en text,
  name_zh_hans text,
  name_zh_hant text,
  description_ko text,
  description_en text,
  description_zh_hans text,
  description_zh_hant text,
  price integer not null check (price >= 0),
  image_path text check (image_path is null or image_path !~ '^[[:space:]]*$'),
  status text not null default 'hidden'
    check (status in ('available', 'sold_out', 'hidden')),
  origin_info jsonb not null default '[]'::jsonb,
  allergen_codes text[] not null default array[]::text[],
  allergen_review_status text not null default 'unreviewed'
    check (allergen_review_status in ('unreviewed', 'reviewed')),
  sort_order integer not null default 0 check (sort_order >= 0),
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_items_valid_origins
    check (qr_menu_private.valid_origin_info(origin_info)),
  constraint menu_items_valid_allergens
    check (qr_menu_private.valid_allergen_codes(allergen_codes)),
  constraint menu_items_published_translations check (
    status = 'hidden' or (
      coalesce(name_en !~ '^[[:space:]]*$', false)
      and coalesce(name_zh_hans !~ '^[[:space:]]*$', false)
      and coalesce(name_zh_hant !~ '^[[:space:]]*$', false)
      and coalesce(description_ko !~ '^[[:space:]]*$', false)
      and coalesce(description_en !~ '^[[:space:]]*$', false)
      and coalesce(description_zh_hans !~ '^[[:space:]]*$', false)
      and coalesce(description_zh_hant !~ '^[[:space:]]*$', false)
    )
  )
);

create index categories_display_order_idx on public.categories(sort_order, id);
create index menu_items_category_order_idx on public.menu_items(category_id, sort_order, id);

create trigger categories_touch_record before update on public.categories
for each row execute function qr_menu_private.touch_record();
create trigger menu_items_touch_record before update on public.menu_items
for each row execute function qr_menu_private.touch_record();

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

revoke all on table public.categories, public.menu_items from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;
grant select on table public.categories, public.menu_items to anon, authenticated;
grant insert (id, name_ko, name_en, name_zh_hans, name_zh_hant, sort_order)
  on public.categories to authenticated;
grant update (name_ko, name_en, name_zh_hans, name_zh_hant, sort_order)
  on public.categories to authenticated;
grant delete on public.categories to authenticated;
grant insert (
  id, category_id, name_ko, name_en, name_zh_hans, name_zh_hant,
  description_ko, description_en, description_zh_hans, description_zh_hant,
  price, image_path, status, origin_info, allergen_codes, allergen_review_status, sort_order
) on public.menu_items to authenticated;
grant update (
  category_id, name_ko, name_en, name_zh_hans, name_zh_hant,
  description_ko, description_en, description_zh_hans, description_zh_hant,
  price, image_path, status, origin_info, allergen_codes, allergen_review_status, sort_order
) on public.menu_items to authenticated;
grant delete on public.menu_items to authenticated;
grant all on table public.categories, public.menu_items to service_role;

-- Every permanent app account is an administrator. Public sign-ups and
-- anonymous sign-ins must be disabled in Supabase Auth (outside SQL).
-- Guests may read published menus; authenticated administrators also see drafts.
create policy categories_public_read on public.categories for select to anon, authenticated
using (true);
create policy menu_items_public_read on public.menu_items for select to anon, authenticated
using (status in ('available', 'sold_out'));
create policy categories_admin_insert on public.categories for insert to authenticated
with check ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');
create policy categories_admin_update on public.categories for update to authenticated
using ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true')
with check ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');
create policy categories_admin_delete on public.categories for delete to authenticated
using ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');

create policy menu_items_admin_read on public.menu_items for select to authenticated
using ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');
create policy menu_items_admin_insert on public.menu_items for insert to authenticated
with check ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');
create policy menu_items_admin_update on public.menu_items for update to authenticated
using ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true')
with check ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');
create policy menu_items_admin_delete on public.menu_items for delete to authenticated
using ((select auth.uid()) is not null and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');

comment on table public.categories is 'QR menu categories, translated into four languages';
comment on table public.menu_items is 'Restaurant menu; every permanent Auth account is an administrator';
comment on column public.menu_items.price is 'Single KRW price, integer won';
comment on column public.menu_items.origin_info is 'Ingredient countries, not a complete recipe or regional origin label';
comment on column public.menu_items.allergen_review_status is 'unreviewed is unknown, not allergen-free';
comment on column public.menu_items.version is 'Optimistic locking: include the previous version in UPDATE filters';

commit;
