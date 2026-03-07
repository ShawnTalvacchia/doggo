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

-- ── provider_service_rates (extras per offering) ─────────────────────────────────
-- Uses canonical rate_type enum; labels come from app constants.
insert into public.provider_service_rates (service_offering_id, rate_type, amount_kc, is_add_on, percent_display, unit, has_tooltip, sort_order)
values
  -- olga-service-1 (walk_checkin, 390)
  ('olga-service-1', 'walk_rate', 113, true, null, 'per 30 min walk', false, 1),
  ('olga-service-1', 'holiday_rate', 534, false, null, 'per visit', true, 2),
  ('olga-service-1', 'additional_dog_rate', 144, true, null, 'per dog, per walk', false, 3),
  ('olga-service-1', 'puppy_rate', 433, false, null, 'per visit', false, 4),
  -- olga-service-2 (inhome_sitting, 980)
  ('olga-service-2', 'holiday_rate', 1176, false, null, 'per night', true, 1),
  ('olga-service-2', 'additional_dog_rate', 529, true, null, 'per dog, per night', false, 2),
  ('olga-service-2', 'puppy_rate', 1078, false, null, 'per night', false, 3),
  ('olga-service-2', 'cat_care', 637, false, null, 'per night', false, 4),
  ('olga-service-2', 'additional_cat', 333, true, null, 'per cat, per night', false, 5),
  ('olga-service-2', 'extended_care', null, false, '50–100', 'of nightly rate', true, 6),
  -- nikola-service-1 (walk_checkin, 470)
  ('nikola-service-1', 'walk_rate', 136, true, null, 'per 30 min walk', false, 1),
  ('nikola-service-1', 'holiday_rate', 644, false, null, 'per visit', true, 2),
  ('nikola-service-1', 'additional_dog_rate', 174, true, null, 'per dog, per walk', false, 3),
  ('nikola-service-1', 'puppy_rate', 522, false, null, 'per visit', false, 4),
  -- nikola-service-2 (boarding, 1100)
  ('nikola-service-2', 'holiday_rate', 1320, false, null, 'per night', true, 1),
  ('nikola-service-2', 'additional_dog_rate', 594, true, null, 'per dog, per night', false, 2),
  ('nikola-service-2', 'puppy_rate', 1210, false, null, 'per night', false, 3),
  ('nikola-service-2', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4),
  -- jana-service-1 (inhome_sitting, 850)
  ('jana-service-1', 'holiday_rate', 1020, false, 'per night', true, 1),
  ('jana-service-1', 'additional_dog_rate', 459, true, 'per dog, per night', false, 2),
  ('jana-service-1', 'puppy_rate', 935, false, 'per night', false, 3),
  ('jana-service-1', 'cat_care', 553, false, 'per night', false, 4),
  ('jana-service-1', 'additional_cat', 289, true, 'per cat, per night', false, 5),
  ('jana-service-1', 'extended_care', null, false, '50–100', 'of nightly rate', true, 6),
  -- jana-service-2 (walk_checkin, 330)
  ('jana-service-2', 'walk_rate', 96, true, null, 'per 30 min walk', false, 1),
  ('jana-service-2', 'holiday_rate', 452, false, null, 'per visit', true, 2),
  ('jana-service-2', 'additional_dog_rate', 122, true, null, 'per dog, per walk', false, 3),
  ('jana-service-2', 'puppy_rate', 366, false, null, 'per visit', false, 4),
  -- jana-service-3 (boarding, 760)
  ('jana-service-3', 'holiday_rate', 912, false, null, 'per night', true, 1),
  ('jana-service-3', 'additional_dog_rate', 410, true, null, 'per dog, per night', false, 2),
  ('jana-service-3', 'puppy_rate', 836, false, null, 'per night', false, 3),
  ('jana-service-3', 'cat_care', 494, false, null, 'per night', false, 4),
  ('jana-service-3', 'additional_cat', 258, true, null, 'per cat, per night', false, 5),
  ('jana-service-3', 'extended_care', null, false, '50–100', 'of nightly rate', true, 6)
on conflict (service_offering_id, rate_type) do nothing;

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

-- ─────────────────────────────────────────────────────────────────────────────
-- Patch existing gaps: jana-k missing experience items, reviews, service offerings
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.provider_experience_items (id, provider_id, category, item_text, sort_order)
values
  ('jana-care-1', 'jana-k', 'care_experience', 'Senior dogs', 1),
  ('jana-care-2', 'jana-k', 'care_experience', 'Shy, fearful or trauma-background dogs', 2),
  ('jana-care-3', 'jana-k', 'care_experience', 'Dogs with chronic health conditions', 3),
  ('jana-care-4', 'jana-k', 'care_experience', 'Post-surgery recovery care', 4),
  ('jana-care-5', 'jana-k', 'care_experience', 'Small and toy breeds', 5),
  ('jana-care-6', 'jana-k', 'care_experience', 'Puppies needing socialisation', 6),
  ('jana-med-1', 'jana-k', 'medical_care', 'Experienced giving oral, topical and injectable medication', 1),
  ('jana-med-2', 'jana-k', 'medical_care', 'Comfortable with dogs on special diets', 2),
  ('jana-med-3', 'jana-k', 'medical_care', 'Post-surgical wound care', 3),
  ('jana-med-4', 'jana-k', 'medical_care', 'Monitoring and reporting health changes', 4),
  ('jana-home-1', 'jana-k', 'home_environment', 'Detached house with private garden', 1),
  ('jana-home-2', 'jana-k', 'home_environment', 'Non-smoking household', 2),
  ('jana-home-3', 'jana-k', 'home_environment', 'No other pets', 3),
  ('jana-home-4', 'jana-k', 'home_environment', 'Very quiet neighbourhood', 4),
  ('jana-home-5', 'jana-k', 'home_environment', 'Potty breaks every 2–3 hours', 5)
on conflict (id) do update set
  provider_id = excluded.provider_id,
  category = excluded.category,
  item_text = excluded.item_text,
  sort_order = excluded.sort_order;

insert into public.provider_service_offerings (
  id, provider_id, service_type, title, short_description, price_from, price_unit, sort_order
)
values
  ('jana-service-2', 'jana-k', 'walk_checkin', 'Walks & Check-ins', 'Gentle, patient walks suited to shy, elderly, or recovering dogs.', 330, 'per_visit', 2),
  ('jana-service-3', 'jana-k', 'boarding', 'Boarding', 'Your dog stays in Jana''s quiet Dejvice house with a private garden.', 760, 'per_night', 3)
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
    'jana-review-1',
    'jana-k',
    'Alžběta N.',
    4.7,
    'Jana cared for our 14-year-old Lab during a difficult period. Her veterinary background was so reassuring and our dog genuinely relaxed in her care.',
    '2026-02-05T10:00:00.000Z'
  ),
  (
    'jana-review-2',
    'jana-k',
    'Radek P.',
    5.0,
    'We have a very shy rescue and most sitters struggle. Jana was completely calm and patient — within an hour the dog was following her around.',
    '2026-01-15T13:30:00.000Z'
  )
on conflict (id) do update set
  provider_id = excluded.provider_id,
  author_name = excluded.author_name,
  rating = excluded.rating,
  review_text = excluded.review_text,
  created_at = excluded.created_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- New providers: Tomáš B., Markéta H., Pavel D., Simona V.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.providers (
  id, name, district, neighborhood, rating, review_count, price_from, price_unit, blurb, avatar_url, services
)
values
  (
    'tomas-b',
    'Tomáš B.',
    'Prague 3',
    'Žižkov',
    4.6,
    7,
    520,
    'per_walk',
    'Solo walks with a trainer''s touch',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin']::service_type[]
  ),
  (
    'marketa-h',
    'Markéta H.',
    'Prague 1',
    'Staré Město',
    5.0,
    34,
    600,
    'per_walk',
    'Premium full-service care in the heart of Prague',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'inhome_sitting', 'boarding']::service_type[]
  ),
  (
    'pavel-d',
    'Pavel D.',
    'Prague 8',
    'Karlín',
    4.5,
    15,
    440,
    'per_walk',
    'Family home, sociable dogs very welcome',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'boarding']::service_type[]
  ),
  (
    'simona-v',
    'Simona V.',
    'Prague 4',
    'Nusle',
    4.8,
    22,
    350,
    'per_visit',
    'Calm, attentive home sitter — always available',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    array['inhome_sitting', 'boarding']::service_type[]
  ),
  (
    'martin-k',
    'Martin K.',
    'Prague 7',
    'Holešovice',
    4.7,
    11,
    480,
    'per_walk',
    'Active walks and reliable boarding by the river',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'boarding']::service_type[]
  ),
  (
    'lenka-s',
    'Lenka S.',
    'Prague 10',
    'Vršovice',
    4.6,
    8,
    310,
    'per_visit',
    'Affordable care for all dogs — walks and overnight',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    array['walk_checkin', 'inhome_sitting', 'boarding']::service_type[]
  ),
  (
    'petr-v',
    'Petr V.',
    'Prague 9',
    'Vysočany',
    4.9,
    18,
    720,
    'per_night',
    'Home away from home — sitting and boarding only',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    array['inhome_sitting', 'boarding']::service_type[]
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
  provider_id, about_title, about_heading, about_body, photo_main_url, photo_side_url, photo_count_label
)
values
  (
    'tomas-b',
    'Solo walks. Real attention.',
    'About Tomáš',
    'I am a certified dog behaviour consultant working out of Žižkov. I walk dogs one at a time — no group walks, no rushing. I specialise in dogs that pull, react, or get anxious around other dogs.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548252139-b12bd2a9a33e?auto=format&fit=crop&w=800&q=80',
    '(19 photos)'
  ),
  (
    'marketa-h',
    'Ten years, zero bad experiences.',
    'About Markéta',
    'I have been caring for other people''s dogs full-time for a decade. I live in a spacious Old Town apartment with easy access to Riegrovy sady and the river. I take a maximum of one household at a time.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    '(112 photos)'
  ),
  (
    'pavel-d',
    'A proper family home for your dog.',
    'About Pavel',
    'I am a stay-at-home dad in Karlín with two kids and two dogs. Our house is lively, warm, and never quiet — perfect for energetic, sociable dogs. We have a garden and a park five minutes away.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    '(55 photos)'
  ),
  (
    'simona-v',
    'Home all day, always present.',
    'About Simona',
    'I work remotely as a translator, so I am home almost all day. My flat in Nusle is calm and comfortable with a balcony and easy access to Nusle valley trails. Great for small dogs and seniors.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    '(67 photos)'
  ),
  (
    'martin-k',
    'Riverside walks and cosy overnight stays.',
    'About Martin',
    'I work from home in Holešovice and love getting out for walks along the Vltava. I offer both drop-in visits and boarding — my flat is calm and dog-friendly, with a small balcony.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    '(38 photos)'
  ),
  (
    'lenka-s',
    'Friendly, affordable care for every dog.',
    'About Lenka',
    'I am a student in Vršovice with a flexible schedule. I offer walks, home sitting, and boarding at fair prices. I grew up with dogs and miss having one around — happy to help out.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    '(24 photos)'
  ),
  (
    'petr-v',
    'Professional care in a quiet Vysočany home.',
    'About Petr',
    'I work in IT and work from home most days. I specialise in overnight care — sitting in your home or boarding in mine. No walks-only; I focus on giving dogs a calm, predictable stay.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    '(52 photos)'
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
  -- Tomáš B.
  ('tomas-care-1', 'tomas-b', 'care_experience', 'Adult dogs', 1),
  ('tomas-care-2', 'tomas-b', 'care_experience', 'Reactive or leash-aggressive dogs', 2),
  ('tomas-care-3', 'tomas-b', 'care_experience', 'Dogs in behaviour modification programmes', 3),
  ('tomas-care-4', 'tomas-b', 'care_experience', 'High-energy breeds', 4),
  ('tomas-care-5', 'tomas-b', 'care_experience', 'Dogs that pull or lunge', 5),
  ('tomas-med-1', 'tomas-b', 'medical_care', 'Experience managing orthopedic and joint conditions during exercise', 1),
  ('tomas-med-2', 'tomas-b', 'medical_care', 'Comfortable adapting pace for recovering dogs', 2),
  ('tomas-home-1', 'tomas-b', 'home_environment', 'Walks only — no overnight boarding', 1),
  ('tomas-home-2', 'tomas-b', 'home_environment', 'Žižkov and surroundings covered', 2),
  ('tomas-home-3', 'tomas-b', 'home_environment', 'One dog per walk, always', 3),
  ('tomas-home-4', 'tomas-b', 'home_environment', 'Morning and evening slots available', 4),
  -- Markéta H.
  ('marketa-care-1', 'marketa-h', 'care_experience', 'Puppies through seniors', 1),
  ('marketa-care-2', 'marketa-h', 'care_experience', 'All breeds and sizes', 2),
  ('marketa-care-3', 'marketa-h', 'care_experience', 'Nervous or rescue dogs', 3),
  ('marketa-care-4', 'marketa-h', 'care_experience', 'Dogs with complex medical needs', 4),
  ('marketa-care-5', 'marketa-h', 'care_experience', 'Multiple-dog households', 5),
  ('marketa-care-6', 'marketa-h', 'care_experience', 'Dogs with strict dietary requirements', 6),
  ('marketa-med-1', 'marketa-h', 'medical_care', 'Comfortable giving oral, topical and injectable medication', 1),
  ('marketa-med-2', 'marketa-h', 'medical_care', 'Experienced with diabetic dogs (insulin monitoring)', 2),
  ('marketa-med-3', 'marketa-h', 'medical_care', 'Post-surgical recovery care', 3),
  ('marketa-med-4', 'marketa-h', 'medical_care', 'Will follow detailed written vet care plans', 4),
  ('marketa-home-1', 'marketa-h', 'home_environment', 'Spacious Old Town apartment', 1),
  ('marketa-home-2', 'marketa-h', 'home_environment', 'Non-smoking household', 2),
  ('marketa-home-3', 'marketa-h', 'home_environment', 'One resident dog (Toy Poodle)', 3),
  ('marketa-home-4', 'marketa-h', 'home_environment', 'Riegrovy sady and river walks nearby', 4),
  ('marketa-home-5', 'marketa-h', 'home_environment', 'One household at a time, always', 5),
  -- Pavel D.
  ('pavel-care-1', 'pavel-d', 'care_experience', 'Adult dogs', 1),
  ('pavel-care-2', 'pavel-d', 'care_experience', 'High-energy and working breeds', 2),
  ('pavel-care-3', 'pavel-d', 'care_experience', 'Sociable, dog-friendly dogs', 3),
  ('pavel-care-4', 'pavel-d', 'care_experience', 'Dogs comfortable around children', 4),
  ('pavel-care-5', 'pavel-d', 'care_experience', 'Dogs that enjoy off-leash play', 5),
  ('pavel-med-1', 'pavel-d', 'medical_care', 'Comfortable giving oral medication', 1),
  ('pavel-med-2', 'pavel-d', 'medical_care', 'Will follow written vet care plans', 2),
  ('pavel-home-1', 'pavel-d', 'home_environment', 'Family house with garden', 1),
  ('pavel-home-2', 'pavel-d', 'home_environment', 'Two resident dogs (Labrador + Beagle)', 2),
  ('pavel-home-3', 'pavel-d', 'home_environment', 'Two children in the home', 3),
  ('pavel-home-4', 'pavel-d', 'home_environment', 'Non-smoking household', 4),
  ('pavel-home-5', 'pavel-d', 'home_environment', 'Prokopovo náměstí park nearby', 5),
  -- Simona V.
  ('simona-care-1', 'simona-v', 'care_experience', 'Small and toy breeds', 1),
  ('simona-care-2', 'simona-v', 'care_experience', 'Senior dogs', 2),
  ('simona-care-3', 'simona-v', 'care_experience', 'Shy or timid dogs', 3),
  ('simona-care-4', 'simona-v', 'care_experience', 'Dogs that need calm, predictable routines', 4),
  ('simona-care-5', 'simona-v', 'care_experience', 'Cat-friendly dogs', 5),
  ('simona-med-1', 'simona-v', 'medical_care', 'Comfortable giving oral medication', 1),
  ('simona-med-2', 'simona-v', 'medical_care', 'Comfortable with special dietary requirements', 2),
  ('simona-med-3', 'simona-v', 'medical_care', 'Will monitor and report health changes', 3),
  ('simona-home-1', 'simona-v', 'home_environment', 'Quiet Nusle apartment', 1),
  ('simona-home-2', 'simona-v', 'home_environment', 'Non-smoking household', 2),
  ('simona-home-3', 'simona-v', 'home_environment', 'One resident cat (calm, dog-friendly)', 3),
  ('simona-home-4', 'simona-v', 'home_environment', 'Balcony with small garden area', 4),
  ('simona-home-5', 'simona-v', 'home_environment', 'Work-from-home — always present', 5),
  ('simona-home-6', 'simona-v', 'home_environment', 'Nusle valley trails nearby', 6),
  -- Martin K.
  ('martin-care-1', 'martin-k', 'care_experience', 'Adult dogs', 1),
  ('martin-care-2', 'martin-k', 'care_experience', 'High-energy breeds', 2),
  ('martin-care-3', 'martin-k', 'care_experience', 'Medium and large dogs', 3),
  ('martin-med-1', 'martin-k', 'medical_care', 'Comfortable giving oral medication', 1),
  ('martin-home-1', 'martin-k', 'home_environment', 'Holešovice apartment near Stromovka', 1),
  ('martin-home-2', 'martin-k', 'home_environment', 'Non-smoking household', 2),
  ('martin-home-3', 'martin-k', 'home_environment', 'Riverside and park walks', 3),
  -- Lenka S.
  ('lenka-care-1', 'lenka-s', 'care_experience', 'Puppies and adult dogs', 1),
  ('lenka-care-2', 'lenka-s', 'care_experience', 'All sizes and breeds', 2),
  ('lenka-med-1', 'lenka-s', 'medical_care', 'Comfortable following vet instructions', 1),
  ('lenka-home-1', 'lenka-s', 'home_environment', 'Vršovice flat near Riegrovy sady', 1),
  ('lenka-home-2', 'lenka-s', 'home_environment', 'Non-smoking, no other pets', 2),
  -- Petr V.
  ('petr-care-1', 'petr-v', 'care_experience', 'Adult and senior dogs', 1),
  ('petr-care-2', 'petr-v', 'care_experience', 'Calm, low-energy dogs', 2),
  ('petr-care-3', 'petr-v', 'care_experience', 'Dogs with predictable routines', 3),
  ('petr-med-1', 'petr-v', 'medical_care', 'Comfortable giving oral and topical medication', 1),
  ('petr-home-1', 'petr-v', 'home_environment', 'Quiet Vysočany house with garden', 1),
  ('petr-home-2', 'petr-v', 'home_environment', 'Overnight care only — no walks', 2),
  ('petr-home-3', 'petr-v', 'home_environment', 'One household at a time', 3)
on conflict (id) do update set
  provider_id = excluded.provider_id,
  category = excluded.category,
  item_text = excluded.item_text,
  sort_order = excluded.sort_order;

insert into public.provider_pets (id, provider_id, name, breed, weight_label, age_label, image_url, sort_order)
values
  (
    'tomas-pet-1',
    'tomas-b',
    'Bořek',
    'Czech Shepherd Mix',
    '28 kg',
    '2 years',
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'marketa-pet-1',
    'marketa-h',
    'Fifi',
    'Toy Poodle',
    '5 kg',
    '6 years',
    'https://images.unsplash.com/photo-1562176566-e9afd27531d4?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'pavel-pet-1',
    'pavel-d',
    'Rudi',
    'Labrador Mix',
    '35 kg',
    '5 years',
    'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'pavel-pet-2',
    'pavel-d',
    'Ferda',
    'Beagle',
    '12 kg',
    '7 years',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=200&q=80',
    2
  ),
  (
    'simona-pet-1',
    'simona-v',
    'Luna',
    'Domestic Shorthair',
    '4 kg',
    '3 years',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'martin-pet-1',
    'martin-k',
    'Štěpán',
    'Border Collie',
    '22 kg',
    '4 years',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=200&q=80',
    1
  ),
  (
    'lenka-pet-1',
    'lenka-s',
    'Bonča',
    'Golden Retriever',
    '28 kg',
    '5 years',
    'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=200&q=80',
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
  id, provider_id, service_type, title, short_description, price_from, price_unit, sort_order
)
values
  -- Tomáš B.
  ('tomas-service-1', 'tomas-b', 'walk_checkin', 'Walks & Check-ins', 'Solo, focused walks — never grouped. Each dog gets undivided attention and a structured route.', 520, 'per_visit', 1),
  -- Markéta H.
  ('marketa-service-1', 'marketa-h', 'walk_checkin', 'Walks & Check-ins', 'Attentive solo walks through central Prague parks, with photo updates.', 600, 'per_visit', 1),
  ('marketa-service-2', 'marketa-h', 'inhome_sitting', 'In-home Sitting', 'Overnight care in your home — full routine, medication, and updates.', 1200, 'per_night', 2),
  ('marketa-service-3', 'marketa-h', 'boarding', 'Boarding', 'Stay in Markéta''s spacious Old Town apartment — one household at a time.', 1350, 'per_night', 3),
  -- Pavel D.
  ('pavel-service-1', 'pavel-d', 'walk_checkin', 'Walks & Check-ins', 'High-energy walks and potty check-ins through Karlín''s parks and trails.', 440, 'per_visit', 1),
  ('pavel-service-2', 'pavel-d', 'boarding', 'Boarding', 'Big family home with two friendly resident dogs and a garden.', 950, 'per_night', 2),
  -- Simona V.
  ('simona-service-1', 'simona-v', 'inhome_sitting', 'In-home Sitting', 'Overnight care in your home — I follow your routines to the letter.', 990, 'per_night', 1),
  ('simona-service-2', 'simona-v', 'boarding', 'Boarding', 'Quiet Nusle flat with a calm resident cat and a balcony garden.', 880, 'per_night', 2),
  -- Martin K.
  ('martin-service-1', 'martin-k', 'walk_checkin', 'Walks & Check-ins', 'Riverside and Stromovka walks — energetic and reliable.', 480, 'per_visit', 1),
  ('martin-service-2', 'martin-k', 'boarding', 'Boarding', 'Calm Holešovice flat with balcony — one dog at a time.', 900, 'per_night', 2),
  -- Lenka S.
  ('lenka-service-1', 'lenka-s', 'walk_checkin', 'Walks & Check-ins', 'Solo walks around Vršovice and Riegrovy sady.', 310, 'per_visit', 1),
  ('lenka-service-2', 'lenka-s', 'inhome_sitting', 'In-home Sitting', 'Overnight care in your home — flexible and attentive.', 750, 'per_night', 2),
  ('lenka-service-3', 'lenka-s', 'boarding', 'Boarding', 'Cosy flat for one dog — great for smaller breeds.', 680, 'per_night', 3),
  -- Petr V.
  ('petr-service-1', 'petr-v', 'inhome_sitting', 'In-home Sitting', 'Full-time presence in your home — routines followed exactly.', 720, 'per_night', 1),
  ('petr-service-2', 'petr-v', 'boarding', 'Boarding', 'Quiet Vysočany house with garden — one household only.', 800, 'per_night', 2)
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
  -- Tomáš B.
  (
    'tomas-review-1',
    'tomas-b',
    'Kateřina D.',
    4.6,
    'Our Lab mix used to drag us down the street. After a few weeks with Tomáš, he walks on a loose lead. The difference is remarkable — and the voice notes after each walk are a lovely touch.',
    '2026-02-20T08:30:00.000Z'
  ),
  (
    'tomas-review-2',
    'tomas-b',
    'Jakub N.',
    4.5,
    'Very professional. He really knows dogs. Our reactive Vizsla came back calm every time.',
    '2026-01-28T17:00:00.000Z'
  ),
  -- Markéta H.
  (
    'marketa-review-1',
    'marketa-h',
    'Veronika T.',
    5.0,
    'Markéta has cared for our Golden for three years. She is genuinely irreplaceable. Detailed updates, vet-liaison when needed, and our dog absolutely adores her.',
    '2026-02-28T10:00:00.000Z'
  ),
  (
    'marketa-review-2',
    'marketa-h',
    'Michal B.',
    5.0,
    'We left our anxious rescue with Markéta for two weeks while abroad. Daily summaries, proactive vet visit when she noticed a minor issue. Exceptional.',
    '2026-02-10T09:00:00.000Z'
  ),
  (
    'marketa-review-3',
    'marketa-h',
    'Aneta V.',
    5.0,
    'She handled our diabetic Dachshund''s insulin schedule without a single problem. I actually felt relaxed on holiday for once.',
    '2026-01-18T14:30:00.000Z'
  ),
  -- Pavel D.
  (
    'pavel-review-1',
    'pavel-d',
    'Tomáš H.',
    4.5,
    'Our Husky boarded with Pavel for a week and came home completely happy. The kids adored him and he had constant company. Great value too.',
    '2026-02-15T11:00:00.000Z'
  ),
  (
    'pavel-review-2',
    'pavel-d',
    'Lenka R.',
    4.5,
    'Very lively household — perfect for our social Boxer. Pavel is reliable and the kids send you cute dog updates.',
    '2026-01-22T10:00:00.000Z'
  ),
  -- Simona V.
  (
    'simona-review-1',
    'simona-v',
    'Hana M.',
    4.8,
    'Simona is an absolute gem. Our senior Dachshund needs a very calm environment and she nailed it. Regular updates, genuine warmth, and Luna even won him over.',
    '2026-02-22T09:00:00.000Z'
  ),
  (
    'simona-review-2',
    'simona-v',
    'Petr S.',
    4.7,
    'She cared for our small Spitz for 10 days while we were abroad. Knowing someone was home with him all day was such a relief.',
    '2026-01-30T16:00:00.000Z'
  ),
  -- Martin K.
  (
    'martin-review-1',
    'martin-k',
    'Eva K.',
    4.7,
    'Martin took our Border Collie for daily riverside walks. Great energy, always on time, and our dog came back exhausted in the best way.',
    '2026-02-18T12:00:00.000Z'
  ),
  (
    'martin-review-2',
    'martin-k',
    'David M.',
    4.6,
    'Boarded our dog for a long weekend. Flat was calm and clean, and Martin sent regular photo updates. Would book again.',
    '2026-01-25T09:30:00.000Z'
  ),
  -- Lenka S.
  (
    'lenka-review-1',
    'lenka-s',
    'Tereza N.',
    4.6,
    'Lenka is sweet and reliable. She sat at our place for three nights — our dog was happy and the flat was spotless when we returned.',
    '2026-02-08T14:00:00.000Z'
  ),
  (
    'lenka-review-2',
    'lenka-s',
    'Ondřej P.',
    4.5,
    'Good value and flexible with times. Our Jack Russell had a great stay.',
    '2026-01-12T11:00:00.000Z'
  ),
  -- Petr V.
  (
    'petr-review-1',
    'petr-v',
    'Marie S.',
    4.9,
    'Petr stayed in our home for a week with our anxious Labrador. He followed every detail of our routine and our dog was completely at ease.',
    '2026-02-25T10:00:00.000Z'
  ),
  (
    'petr-review-2',
    'petr-v',
    'Jan T.',
    4.9,
    'Professional and calm. Our senior dog boarded at his place and came back relaxed. Highly recommend.',
    '2026-02-02T15:30:00.000Z'
  )
on conflict (id) do update set
  provider_id = excluded.provider_id,
  author_name = excluded.author_name,
  rating = excluded.rating,
  review_text = excluded.review_text,
  created_at = excluded.created_at;

-- ── provider_service_rates for Martin K., Lenka S., Petr V. ─────────────────────
insert into public.provider_service_rates (service_offering_id, rate_type, amount_kc, is_add_on, percent_display, unit, has_tooltip, sort_order)
values
  ('martin-service-1', 'walk_rate', 139, true, null, 'per 30 min walk', false, 1),
  ('martin-service-1', 'holiday_rate', 658, false, null, 'per visit', true, 2),
  ('martin-service-1', 'additional_dog_rate', 178, true, null, 'per dog, per walk', false, 3),
  ('martin-service-1', 'puppy_rate', 533, false, null, 'per visit', false, 4),
  ('martin-service-2', 'holiday_rate', 1080, false, null, 'per night', true, 1),
  ('martin-service-2', 'additional_dog_rate', 486, true, null, 'per dog, per night', false, 2),
  ('martin-service-2', 'puppy_rate', 990, false, null, 'per night', false, 3),
  ('martin-service-2', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4),
  ('lenka-service-1', 'walk_rate', 90, true, null, 'per 30 min walk', false, 1),
  ('lenka-service-1', 'holiday_rate', 425, false, null, 'per visit', true, 2),
  ('lenka-service-1', 'additional_dog_rate', 115, true, null, 'per dog, per walk', false, 3),
  ('lenka-service-1', 'puppy_rate', 344, false, null, 'per visit', false, 4),
  ('lenka-service-2', 'holiday_rate', 900, false, null, 'per night', true, 1),
  ('lenka-service-2', 'additional_dog_rate', 405, true, null, 'per dog, per night', false, 2),
  ('lenka-service-2', 'puppy_rate', 825, false, null, 'per night', false, 3),
  ('lenka-service-2', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4),
  ('lenka-service-3', 'holiday_rate', 816, false, null, 'per night', true, 1),
  ('lenka-service-3', 'additional_dog_rate', 367, true, null, 'per dog, per night', false, 2),
  ('lenka-service-3', 'puppy_rate', 748, false, null, 'per night', false, 3),
  ('lenka-service-3', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4),
  ('petr-service-1', 'holiday_rate', 864, false, null, 'per night', true, 1),
  ('petr-service-1', 'additional_dog_rate', 389, true, null, 'per dog, per night', false, 2),
  ('petr-service-1', 'puppy_rate', 792, false, null, 'per night', false, 3),
  ('petr-service-1', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4),
  ('petr-service-2', 'holiday_rate', 960, false, null, 'per night', true, 1),
  ('petr-service-2', 'additional_dog_rate', 432, true, null, 'per dog, per night', false, 2),
  ('petr-service-2', 'puppy_rate', 880, false, null, 'per night', false, 3),
  ('petr-service-2', 'extended_care', null, false, '50–100', 'of nightly rate', true, 4)
on conflict (service_offering_id, rate_type) do nothing;
