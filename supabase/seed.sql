insert into public.providers (
  id,
  name,
  district,
  neighborhood,
  rating,
  review_count,
  price_from,
  price_unit,
  blurb,
  avatar_url,
  services
)
values
  (
    'olga-m',
    'Olga M.',
    'Prague 5',
    'Smichov',
    4.8,
    12,
    390,
    'per_walk',
    'Clean, fun & safe home for your pup',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'inhome_sitting']::service_type[]
  ),
  (
    'nikola-r',
    'Nikola R.',
    'Prague 2',
    'Vinohrady',
    4.9,
    20,
    470,
    'per_walk',
    'Structured walks and calm routines',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'boarding']::service_type[]
  ),
  (
    'jana-k',
    'Jana K.',
    'Prague 6',
    'Dejvice',
    4.7,
    9,
    330,
    'per_visit',
    'Patient care for shy and senior dogs',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'inhome_sitting', 'boarding']::service_type[]
  )
on conflict (id) do update set
  name = excluded.name,
  district = excluded.district,
  neighborhood = excluded.neighborhood,
  rating = excluded.rating,
  review_count = excluded.review_count,
  price_from = excluded.price_from,
  price_unit = excluded.price_unit,
  blurb = excluded.blurb,
  avatar_url = excluded.avatar_url,
  services = excluded.services,
  updated_at = now();

insert into public.provider_profiles (
  provider_id,
  about_title,
  about_heading,
  about_body,
  photo_main_url,
  photo_side_url,
  photo_count_label
)
values
  (
    'olga-m',
    'Home full-time with lots of Love!!',
    'About Olga',
    'I have been taking care of dogs since I was a child. My whole family taught me to love them and pay attention to their routines, comfort, and safety.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
    '(127 photos)'
  ),
  (
    'nikola-r',
    'Calm structure and thoughtful care',
    'About Nikola',
    'I focus on routine, enrichment, and dependable communication so dogs stay confident while owners are away.',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&q=80',
    '(84 photos)'
  ),
  (
    'jana-k',
    'Gentle support for shy and senior dogs',
    'About Jana',
    'I adapt pace and routines for sensitive dogs, including medication reminders and quieter home setups.',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    '(43 photos)'
  )
on conflict (provider_id) do update set
  about_title = excluded.about_title,
  about_heading = excluded.about_heading,
  about_body = excluded.about_body,
  photo_main_url = excluded.photo_main_url,
  photo_side_url = excluded.photo_side_url,
  photo_count_label = excluded.photo_count_label,
  updated_at = now();

insert into public.provider_experience_items (id, provider_id, category, item_text, sort_order)
values
  ('olga-care-1', 'olga-m', 'care_experience', 'Puppies', 1),
  ('olga-care-2', 'olga-m', 'care_experience', 'Adult Dogs', 2),
  ('olga-care-3', 'olga-m', 'care_experience', 'Senior Dogs', 3),
  ('olga-care-4', 'olga-m', 'care_experience', 'Shy or anxious dogs', 4),
  ('olga-care-5', 'olga-m', 'care_experience', 'High-energy dogs', 5),
  ('olga-care-6', 'olga-m', 'care_experience', 'Dogs with routines (feeding, meds)', 6),
  ('olga-med-1', 'olga-m', 'medical_care', 'Comfortable giving oral medication', 1),
  ('olga-med-2', 'olga-m', 'medical_care', 'Comfortable following vet instructions', 2),
  ('olga-med-3', 'olga-m', 'medical_care', 'Experience with special-needs dogs', 3),
  ('olga-home-1', 'olga-m', 'home_environment', 'Lives on a farm/ranch', 1),
  ('olga-home-2', 'olga-m', 'home_environment', 'Has a fenced yard', 2),
  ('olga-home-3', 'olga-m', 'home_environment', 'Non-smoking household', 3),
  ('olga-home-4', 'olga-m', 'home_environment', 'No children present', 4),
  ('olga-home-5', 'olga-m', 'home_environment', 'Potty breaks every 2-4 hours', 5),
  ('olga-home-6', 'olga-m', 'home_environment', 'Dogs allowed on furniture', 6),
  ('nikola-care-1', 'nikola-r', 'care_experience', 'Adult Dogs', 1),
  ('nikola-care-2', 'nikola-r', 'care_experience', 'High-energy dogs', 2),
  ('nikola-med-1', 'nikola-r', 'medical_care', 'Can provide basic medication reminders', 1),
  ('nikola-home-1', 'nikola-r', 'home_environment', 'Apartment with nearby parks', 1)
on conflict (id) do update set
  provider_id = excluded.provider_id,
  category = excluded.category,
  item_text = excluded.item_text,
  sort_order = excluded.sort_order;

insert into public.provider_pets (id, provider_id, name, breed, weight_label, age_label, image_url, sort_order)
values
  (
    'olga-pet-1',
    'olga-m',
    'Gandi',
    'Cat',
    '15 lbs',
    '10 years, 2 months',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'olga-pet-2',
    'olga-m',
    'Cabezon',
    'Mixed',
    '80 lbs',
    '15 years, 4 months',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80',
    2
  ),
  (
    'nikola-pet-1',
    'nikola-r',
    'Milo',
    'Mixed',
    '42 lbs',
    '4 years',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80',
    1
  )
on conflict (id) do update set
  provider_id = excluded.provider_id,
  name = excluded.name,
  breed = excluded.breed,
  weight_label = excluded.weight_label,
  age_label = excluded.age_label,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

insert into public.provider_service_offerings (
  id,
  provider_id,
  service_type,
  title,
  short_description,
  price_from,
  price_unit,
  sort_order
)
values
  ('olga-service-1', 'olga-m', 'walk_checkin', 'Walks and Check-ins', 'Neighborhood walks and check-ins with photo updates.', 390, 'per_visit', 1),
  ('olga-service-2', 'olga-m', 'inhome_sitting', 'In-home Sitting', 'In-home care that follows your feeding and comfort routines.', 980, 'per_night', 2),
  ('nikola-service-1', 'nikola-r', 'walk_checkin', 'Structured Walks', 'Energy-focused walks with routine consistency.', 470, 'per_visit', 1),
  ('nikola-service-2', 'nikola-r', 'boarding', 'Overnight Boarding', 'Calm overnight care for one household at a time.', 1100, 'per_night', 2),
  ('jana-service-1', 'jana-k', 'inhome_sitting', 'Senior-focused Home Visits', 'Gentle pace and medication-aware home visits.', 850, 'per_night', 1)
on conflict (id) do update set
  provider_id = excluded.provider_id,
  service_type = excluded.service_type,
  title = excluded.title,
  short_description = excluded.short_description,
  price_from = excluded.price_from,
  price_unit = excluded.price_unit,
  sort_order = excluded.sort_order;

insert into public.provider_reviews (id, provider_id, author_name, rating, review_text, created_at)
values
  (
    'olga-review-1',
    'olga-m',
    'Lucie P.',
    5.0,
    'Olga was amazing with our rescue. We got thoughtful updates and came home to a calm, happy dog.',
    '2026-02-12T10:00:00.000Z'
  ),
  (
    'olga-review-2',
    'olga-m',
    'Martin S.',
    4.8,
    'Very reliable and communicative. Great for dogs who need routine and consistency.',
    '2026-01-27T14:30:00.000Z'
  ),
  (
    'nikola-review-1',
    'nikola-r',
    'Eva K.',
    4.9,
    'Nikola handled our high-energy shepherd perfectly and sent clear check-ins every day.',
    '2026-02-05T09:15:00.000Z'
  )
on conflict (id) do update set
  provider_id = excluded.provider_id,
  author_name = excluded.author_name,
  rating = excluded.rating,
  review_text = excluded.review_text,
  created_at = excluded.created_at;
