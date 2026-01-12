# Product Suggestions System

The product suggestions feature allows users to submit new food items for review. Suggestions are stored in a Supabase database table for manual review and approval.

## Database Setup

### 1. Create the Table

Run the SQL script to create the `product_suggestions` table:

```bash
# Option 1: Using Supabase SQL Editor
# Go to: https://app.supabase.com/project/_/sql
# Copy and paste the contents of: supabase/create_product_suggestions_table.sql
# Click "Run"

# Option 2: Using psql command line
psql -h your-supabase-host -U postgres -d postgres -f supabase/create_product_suggestions_table.sql
```

The table includes:
- `id`: Unique identifier
- `product_name`: Name of the suggested product
- `product_type`: Either 'fruit' or 'groente'
- `product_category`: Optional category (e.g., Kruiden, Specerijen)
- `suggested_by_user_id`: User who submitted the suggestion
- `status`: 'pending', 'approved', or 'rejected'
- `created_at`: When the suggestion was submitted
- `reviewed_at`: When it was reviewed
- `reviewed_by_user_id`: Who reviewed it

## How It Works

### User Flow

1. User navigates to the "Suggesties" page
2. Fills out the form:
   - Product naam (required)
   - Product type: Groente or Fruit (required)
   - Product categorie (optional dropdown)
3. Submits the form
4. Suggestion is saved to the database with status 'pending'
5. User sees success message

### Admin Review Process

Use the helper script `supabase/approve_suggestion.sql` for step-by-step guidance:

#### Quick Steps:

1. **View pending suggestions**:
   ```sql
   SELECT
     ps.id,
     ps.product_name,
     ps.product_type,
     ps.product_category,
     u.display_name as suggested_by
   FROM product_suggestions ps
   JOIN users u ON ps.suggested_by_user_id = u.id
   WHERE ps.status = 'pending'
   ORDER BY ps.created_at DESC;
   ```

2. **Copy the UUID** from the `id` column (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

3. **Approve and add to food items**:
   ```sql
   BEGIN;

   -- Add to food_items
   INSERT INTO food_items (name_nl, type, category)
   VALUES ('Mango', 'fruit', NULL);

   -- Mark as approved (REPLACE the UUID!)
   UPDATE product_suggestions
   SET status = 'approved', reviewed_at = NOW()
   WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

   COMMIT;
   ```

**IMPORTANT**:
- Always copy the full UUID from the query results
- Don't use the placeholder text 'suggestion-id'
- Use NULL (no quotes) if there's no category

### Viewing Suggestions

Query pending suggestions:

```sql
SELECT
  ps.*,
  u.display_name as suggested_by
FROM product_suggestions ps
JOIN users u ON ps.suggested_by_user_id = u.id
WHERE ps.status = 'pending'
ORDER BY ps.created_at DESC;
```

## Environment Variables

Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment:

```bash
# .env.local
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Also add it to Vercel environment variables for production.

## Row Level Security (RLS)

The table has RLS policies that:
- Allow any authenticated user to insert suggestions
- Allow users to view their own suggestions
- Allow all authenticated users to view all suggestions (for transparency)
- You can modify these policies based on your needs

## Future Enhancements

Potential improvements:
- Admin dashboard to review/approve suggestions in the app
- Notifications when suggestions are approved/rejected
- Duplicate detection before inserting
- Bulk approval feature
- Statistics on most requested items
