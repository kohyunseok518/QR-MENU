-- Read-only verification of the initial catalog and RLS setup.
select 'categories' as metric, count(*)::text as value from public.categories
union all select 'menu_items', count(*)::text from public.menu_items
union all select 'published_menus', count(*)::text from public.menu_items
  where status in ('available', 'sold_out')
union all select 'menus_with_photos', count(*)::text from public.menu_items where image_path is not null
union all select 'allergens_unreviewed', count(*)::text from public.menu_items
  where allergen_review_status = 'unreviewed'
union all select 'tables_with_rls', count(*)::text from pg_tables
  where schemaname = 'public' and tablename in ('categories', 'menu_items') and rowsecurity
union all select 'test_rows_remaining', count(*)::text from (
  select id from public.categories where id::text like '90000000-%'
  union all select id from public.menu_items where id::text like '90000000-%'
) as test_rows;
