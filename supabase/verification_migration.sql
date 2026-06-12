-- Deed verification requests

CREATE TABLE IF NOT EXISTS deed_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES land_listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES land_sellers(id) ON DELETE CASCADE,
  title_deed_number TEXT,
  notes TEXT,
  amount_paid_zmw NUMERIC(10,2) DEFAULT 50,
  is_paid BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending', -- pending, paid, verified, rejected
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
