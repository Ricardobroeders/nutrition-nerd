# CSV Import Script

This script imports food items from CSV files into your Supabase database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** You need the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) to run this script. You can find this in your Supabase project settings under "API" → "Service Role Key".

## CSV Format

The script expects CSV files with the following columns:
- `naam` - Name of the food item (Dutch)
- `type` - Type (fruit, groente, kruid, specerij, wortel)
- `belangrijkste_voedingsstof` - Main nutrient

Example:
```csv
naam,type,belangrijkste_voedingsstof
Andijvie,groente,vitamine K
Sinaasappel,fruit,vitamine C
Basilicum,kruid,vitamine K
```

## Type Mapping

The script maps CSV types to the database schema as follows:

### Database `type` field (fruit or groente):
- `fruit` → `fruit`
- `groente` → `groente`
- `kruid` → `groente` (stored as groente)
- `specerij` → `groente` (stored as groente)
- `wortel` → `groente` (stored as groente)

### Database `category` field:
- `fruit` → `null` (no category)
- `groente` → `null` (no category)
- `kruid` → `"Kruiden"`
- `specerij` → `"Specerijen"`
- `wortel` → `"Knolgewassen"`

## Running the Import

Place your CSV files in the `input/` directory and run:

```bash
npm run import-csv
```

The script will:
1. Read all CSV files from the `input/` directory
2. Parse each row
3. Check if the item already exists (by name)
4. Insert new items into the `food_items` table
5. Display a summary of imported, skipped, and failed items

## Output

The script provides detailed logging:
- ✅ Successfully imported items
- ⏭️ Skipped items (already exist)
- ❌ Errors (with error messages)

Example output:
```
🚀 Starting CSV import to Supabase...

Processing: lijst2.csv
Found 201 rows in CSV
✅ Imported: Andijvie (groente)
⏭️  Skipping (already exists): Artisjok
✅ Imported: Asperge (groente)
...

==================================================
📊 Import Summary:
==================================================
✅ Successfully imported: 195
⏭️  Skipped (duplicates):  6
❌ Errors:                0
==================================================

✨ Import completed!
```

## Troubleshooting

### Missing environment variables
If you see "Missing Supabase environment variables", make sure:
1. `.env.local` file exists in the project root
2. Both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### Permission errors
Make sure you're using the `SUPABASE_SERVICE_ROLE_KEY`, not the anon key. The service role key has admin privileges needed for bulk inserts.

### Duplicate items
The script automatically skips items that already exist in the database (based on `name_nl`). This is safe and expected behavior.
