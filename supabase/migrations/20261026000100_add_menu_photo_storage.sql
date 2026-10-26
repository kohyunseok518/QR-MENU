-- Public menu photographs; only permanent administrator accounts can upload.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Do not silently reuse an incompatible existing bucket.
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'menu-images'
    and public and file_size_limit = 5242880
    and allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']) then
    raise exception 'menu-images bucket configuration differs from this migration';
  end if;
end;
$$;

create policy menu_photo_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'menu-images' and (select auth.uid()) is not null
  and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');

create policy menu_photo_admin_read on storage.objects for select to authenticated
using (bucket_id = 'menu-images' and (select auth.uid()) is not null
  and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') <> 'true');

-- No client overwrite/delete policy. Replacing a photo creates a new UUID path.
-- Public file delivery is handled by the public bucket, without public listing.
commit;
