-- Storage object metadata only; no file uploaded. All test mutations roll back.
begin;
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'menu-images'
      and public and file_size_limit = 5242880
      and allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']) then
    raise exception 'FAIL: photo bucket configuration';
  end if;
  if exists (select 1 from pg_policies where schemaname = 'storage'
      and tablename = 'objects' and cmd in ('DELETE', 'ALL')) then
    raise exception 'FAIL: unexpected client deletion policy';
  end if;
end;
$$;

set local role anon;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name)
    values ('menu-images', 'qr-menu-policy-test-guest.jpg');
    raise exception 'FAIL: guest photo upload allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000099","role":"authenticated","is_anonymous":false}', true);
set local role authenticated;
do $$
declare affected integer;
begin
  insert into storage.objects (bucket_id, name)
  values ('menu-images', 'qr-menu-policy-test-admin.jpg');
  if not exists (select 1 from storage.objects where bucket_id = 'menu-images'
      and name = 'qr-menu-policy-test-admin.jpg') then
    raise exception 'FAIL: administrator cannot read photo metadata';
  end if;
  update storage.objects set name = 'qr-menu-policy-test-overwrite.jpg'
  where bucket_id = 'menu-images' and name = 'qr-menu-policy-test-admin.jpg';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'FAIL: photo overwrite allowed'; end if;
end;
$$;
reset role;

select set_config('request.jwt.claims',
  '{"sub":"90000000-0000-4000-8000-000000000099","role":"authenticated","is_anonymous":true}', true);
set local role authenticated;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name)
    values ('menu-images', 'qr-menu-policy-test-anonymous.jpg');
    raise exception 'FAIL: anonymous Auth photo upload allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;

select 'PASS: public photo bucket; admin insert only; guest and anonymous uploads denied; no overwrites/deletes; all test metadata rolled back' as verification;
