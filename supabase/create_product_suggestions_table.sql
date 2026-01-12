-- Create product_suggestions table
CREATE TABLE IF NOT EXISTS product_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('fruit', 'groente')),
  product_category TEXT,
  suggested_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by_user_id UUID REFERENCES users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_suggestions_status ON product_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_product_suggestions_created_at ON product_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_suggestions_user ON product_suggestions(suggested_by_user_id);

-- Enable Row Level Security
ALTER TABLE product_suggestions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own suggestions
CREATE POLICY "Users can create suggestions"
  ON product_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = suggested_by_user_id);

-- Policy: Users can view their own suggestions
CREATE POLICY "Users can view their own suggestions"
  ON product_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = suggested_by_user_id);

-- Policy: Admin users can view all suggestions (optional - you can modify this based on your admin setup)
-- For now, let's allow all authenticated users to view all suggestions
CREATE POLICY "Users can view all suggestions"
  ON product_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment on table
COMMENT ON TABLE product_suggestions IS 'Stores product suggestions submitted by users for review';
COMMENT ON COLUMN product_suggestions.status IS 'Status of the suggestion: pending, approved, or rejected';
