-- LandZM schema

CREATE TABLE IF NOT EXISTS land_sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS land_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES land_sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Lusaka',
  size_acres NUMERIC(10,2),
  price_zmw NUMERIC(12,2) NOT NULL,
  land_type TEXT NOT NULL, -- residential, commercial, agricultural, industrial
  title_deed_status TEXT NOT NULL DEFAULT 'pending', -- verified, pending, none
  description TEXT,
  contact_phone TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS land_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES land_listings(id) ON DELETE CASCADE,
  enquirer_name TEXT NOT NULL,
  enquirer_phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
