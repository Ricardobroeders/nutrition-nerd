import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CsvRow {
  naam: string;
  type: string;
  belangrijkste_voedingsstof: string;
}

// Category mapping based on the type field
function getCategoryFromType(type: string): string | null {
  const categoryMap: { [key: string]: string } = {
    'kruid': 'Kruiden',
    'specerij': 'Specerijen',
    'wortel': 'Knolgewassen',
  };

  return categoryMap[type] || null;
}

// Determine the correct type for food_items table (fruit or groente)
function getFoodType(type: string): 'fruit' | 'groente' {
  if (type === 'fruit') {
    return 'fruit';
  }
  // Everything else (groente, kruid, specerij, wortel) is categorized as 'groente'
  return 'groente';
}

async function importCsvFile(filePath: string) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);

  // Read CSV file
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse CSV
  const records: CsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${records.length} rows in CSV`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const record of records) {
    if (!record.naam || !record.type) {
      console.log(`Skipping row with missing data: ${JSON.stringify(record)}`);
      skippedCount++;
      continue;
    }

    const foodItem = {
      name_nl: record.naam,
      type: getFoodType(record.type),
      category: getCategoryFromType(record.type),
      nutrient: record.belangrijkste_voedingsstof || null,
    };

    // Check if item already exists
    const { data: existing } = await supabase
      .from('food_items')
      .select('id')
      .eq('name_nl', foodItem.name_nl)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping (already exists): ${foodItem.name_nl}`);
      skippedCount++;
      continue;
    }

    // Insert new item
    const { data, error } = await supabase
      .from('food_items')
      .insert(foodItem)
      .select();

    if (error) {
      console.error(`❌ Error inserting ${foodItem.name_nl}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Imported: ${foodItem.name_nl} (${foodItem.type}${foodItem.category ? ` - ${foodItem.category}` : ''})`);
      successCount++;
    }
  }

  return { successCount, errorCount, skippedCount };
}

async function main() {
  console.log('🚀 Starting CSV import to Supabase...\n');

  const inputDir = path.join(process.cwd(), 'input');
  const csvFiles = [
    path.join(inputDir, 'lijst2.csv'),
    path.join(inputDir, 'lijst3.csv'),
  ];

  let totalSuccess = 0;
  let totalErrors = 0;
  let totalSkipped = 0;

  for (const csvFile of csvFiles) {
    if (!fs.existsSync(csvFile)) {
      console.error(`❌ File not found: ${csvFile}`);
      continue;
    }

    const result = await importCsvFile(csvFile);
    totalSuccess += result.successCount;
    totalErrors += result.errorCount;
    totalSkipped += result.skippedCount;
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${totalSuccess}`);
  console.log(`⏭️  Skipped (duplicates):  ${totalSkipped}`);
  console.log(`❌ Errors:                ${totalErrors}`);
  console.log('='.repeat(50));
}

main()
  .then(() => {
    console.log('\n✨ Import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
