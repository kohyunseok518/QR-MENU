-- Run after migrations and seed, as postgres in the Dashboard SQL Editor.
-- Every row mutation in this regression check is rolled back.
begin;

do $$
begin
  if (select count(*) from pg_tables where schemaname = 'public'
      and tablename in ('categories', 'menu_items') and rowsecurity) <> 2 then
    raise exception 'FAIL: both menu tables must have RLS';
  end if;
  if has_table_privilege('anon', 'public.categories', 'INSERT')
    or has_table_privilege('anon', 'public.menu_items', 'UPDATE')
    or has_table_privilege('anon', 'public.menu_items', 'DELETE')
    or has_table_privilege('authenticated', 'public.menu_items', 'TRUNCATE') then
    raise exception 'FAIL: excessive table grants';
  end if;
end;
$$;

insert into public.menu_items (id, category_id, name_ko, price, status)
values ('90000000-0000-4000-8000-000000000001',
        '10000000-0000-4000-8000-000000000001', 'Permission test draft', 0, 'hidden');

set local role anon;
do $$
begin
  if (select count(*) from public.menu_items
      where id = '90000000-0000-4000-8000-000000000001') <> 0 then
    raise exception 'FAIL: guest can read a hidden menu';
  end if;
  if (select count(*) from public.menu_items) <> 19 then
    raise exception 'FAIL: guest cannot read the 19 published menus';
  end if;
  begin
    insert into public.categories (name_ko, name_en, name_zh_hans, name_zh_hant)
    values ('Unauthorized', 'Unauthorized', 'Unauthorized', 'Unauthorized');
    raise exception 'FAIL: guest insert was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.menu_items set price = 1
    where id = '20000000-0000-4000-8000-000000000001';
    raise exception 'FAIL: guest update was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.menu_items
    where id = '20000000-0000-4000-8000-000000000001';
    raise exception 'FAIL: guest delete was allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000099","role":"authenticated","is_anonymous":false}', true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.menu_items
      where id = '90000000-0000-4000-8000-000000000001') <> 1 then
    raise exception 'FAIL: administrator cannot read a draft';
  end if;

  insert into public.categories (id, name_ko, name_en, name_zh_hans, name_zh_hant)
  values ('90000000-0000-4000-8000-000000000002', 'Test', 'Test', 'Test', 'Test');
  insert into public.menu_items (
    id, category_id, name_ko, name_en, name_zh_hans, name_zh_hant,
    description_ko, description_en, description_zh_hans, description_zh_hant,
    price, status
  ) values (
    '90000000-0000-4000-8000-000000000003',
    '90000000-0000-4000-8000-000000000002',
    'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 1234, 'available'
  );
  update public.menu_items set price = 1235
  where id = '90000000-0000-4000-8000-000000000003';
  if not exists (select 1 from public.menu_items
      where id = '90000000-0000-4000-8000-000000000003' and price = 1235 and version = 2) then
    raise exception 'FAIL: administrator update or version trigger';
  end if;

  begin
    update public.menu_items set version = 99
    where id = '90000000-0000-4000-8000-000000000003';
    raise exception 'FAIL: client can overwrite version';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.menu_items set price = -1
    where id = '90000000-0000-4000-8000-000000000003';
    raise exception 'FAIL: negative price was allowed';
  exception when check_violation then null;
  end;
  begin
    update public.menu_items set status = 'available'
    where id = '90000000-0000-4000-8000-000000000001';
    raise exception 'FAIL: incomplete draft was published';
  exception when check_violation then null;
  end;
  begin
    update public.menu_items set origin_info =
      '[{"ingredient_code":"beef","country_codes":["ZZ"]}]'::jsonb
    where id = '90000000-0000-4000-8000-000000000003';
    raise exception 'FAIL: invalid origin country was allowed';
  exception when check_violation then null;
  end;
  begin
    update public.menu_items set allergen_codes = array['invented_allergen']
    where id = '90000000-0000-4000-8000-000000000003';
    raise exception 'FAIL: invalid allergen was allowed';
  exception when check_violation then null;
  end;
  delete from public.menu_items where id = '90000000-0000-4000-8000-000000000003';
  delete from public.categories where id = '90000000-0000-4000-8000-000000000002';
  if exists (select 1 from public.categories
      where id = '90000000-0000-4000-8000-000000000002') then
    raise exception 'FAIL: administrator delete was not applied';
  end if;

  update public.menu_items set status = 'sold_out'
  where id = '20000000-0000-4000-8000-000000000001';
end;
$$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000099","role":"authenticated","is_anonymous":true}', true);
set local role authenticated;
do $$
declare changed integer;
begin
  if exists (select 1 from public.menu_items
      where id = '90000000-0000-4000-8000-000000000001') then
    raise exception 'FAIL: anonymous Auth session can read drafts';
  end if;
  begin
    insert into public.categories (name_ko, name_en, name_zh_hans, name_zh_hant)
    values ('Unauthorized', 'Unauthorized', 'Unauthorized', 'Unauthorized');
    raise exception 'FAIL: anonymous Auth insert was allowed';
  exception when insufficient_privilege then null;
  end;
  update public.menu_items set price = 1
  where id = '20000000-0000-4000-8000-000000000001';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: anonymous Auth update was allowed'; end if;
  delete from public.menu_items
  where id = '20000000-0000-4000-8000-000000000001';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: anonymous Auth delete was allowed'; end if;
end;
$$;
reset role;

set local role anon;
do $$
begin
  if not exists (select 1 from public.menu_items
      where id = '20000000-0000-4000-8000-000000000001' and status = 'sold_out') then
    raise exception 'FAIL: guests cannot read sold-out menus';
  end if;
end;
$$;
reset role;

rollback;
select 'PASS: guest read-only; admin CRUD; anonymous Auth denied; constraints and version trigger; all mutations rolled back' as verification;
