-- Script to help approve product suggestions
-- Usage: Replace the placeholder values and run each section as needed

-- ============================================
-- STEP 1: View all pending suggestions
-- ============================================
SELECT
  ps.id,
  ps.product_name,
  ps.product_type,
  ps.product_category,
  ps.created_at,
  u.display_name as suggested_by,
  u.email as user_email
FROM product_suggestions ps
JOIN users u ON ps.suggested_by_user_id = u.id
WHERE ps.status = 'pending'
ORDER BY ps.created_at DESC;

-- ============================================
-- STEP 2: Approve a suggestion and add to food_items
-- ============================================
-- IMPORTANT:
-- 1. Copy the 'id' from the result above (it will be a UUID like: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
-- 2. Replace 'PASTE-UUID-HERE' below with the actual id
-- 3. Replace 'Product Name', 'fruit', and 'Category' with actual values
-- 4. Run the entire block below as a transaction

BEGIN;

-- Add the product to food_items table
INSERT INTO food_items (name_nl, type, category)
VALUES (
  'PASTE-PRODUCT-NAME-HERE',  -- e.g. 'Mango'
  'PASTE-TYPE-HERE',           -- either 'fruit' or 'groente'
  'PASTE-CATEGORY-HERE'        -- e.g. 'Kruiden' or NULL if no category
);

-- Mark the suggestion as approved
UPDATE product_suggestions
SET
  status = 'approved',
  reviewed_at = NOW()
WHERE id = 'PASTE-UUID-HERE';

COMMIT;

-- ============================================
-- STEP 3: Reject a suggestion (optional)
-- ============================================
-- Replace 'PASTE-UUID-HERE' with the actual suggestion id
UPDATE product_suggestions
SET
  status = 'rejected',
  reviewed_at = NOW()
WHERE id = 'PASTE-UUID-HERE';

-- ============================================
-- EXAMPLE: Complete approval workflow
-- ============================================
-- Let's say you got this from STEP 1:
-- id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- product_name: 'Mango'
-- product_type: 'fruit'
-- product_category: NULL

-- Here's how you would approve it:

-- BEGIN;
--
-- INSERT INTO food_items (name_nl, type, category)
-- VALUES ('Mango', 'fruit', NULL);
--
-- UPDATE product_suggestions
-- SET
--   status = 'approved',
--   reviewed_at = NOW()
-- WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
--
-- COMMIT;

-- ============================================
-- View all suggestions (including approved/rejected)
-- ============================================
SELECT
  ps.id,
  ps.product_name,
  ps.product_type,
  ps.product_category,
  ps.status,
  ps.created_at,
  ps.reviewed_at,
  u.display_name as suggested_by
FROM product_suggestions ps
JOIN users u ON ps.suggested_by_user_id = u.id
ORDER BY ps.created_at DESC;
