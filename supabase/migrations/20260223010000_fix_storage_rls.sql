-- Allow authenticated users to upload to the itinerary-images bucket
insert into storage.buckets (id, name, public)
values ('itinerary-images', 'itinerary-images', true)
on conflict (id) do update set public = true;

-- Policy to allow authenticated users to upload images
create policy "Allow authenticated users to upload images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'itinerary-images');

-- Policy to allow authenticated users to update their own images
create policy "Allow authenticated users to update their own images"
on storage.objects for update
to authenticated
using (auth.uid() = owner)
with check (bucket_id = 'itinerary-images');

-- Policy to allow public to view images
create policy "Allow public to view images"
on storage.objects for select
to public
using (bucket_id = 'itinerary-images');

-- Policy to allow owners to delete their own images
create policy "Allow owners to delete their own images"
on storage.objects for delete
to authenticated
using (auth.uid() = owner);
