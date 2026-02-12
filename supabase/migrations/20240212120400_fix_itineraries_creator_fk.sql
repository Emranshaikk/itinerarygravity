-- Add missing foreign key constraint for itineraries.creator_id -> profiles.id
ALTER TABLE public.itineraries
ADD CONSTRAINT itineraries_creator_id_fkey
FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;
