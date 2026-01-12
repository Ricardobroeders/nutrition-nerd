import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, productType, productCategory, userId } = body;

    // Validate required fields
    if (!productName || !productType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert suggestion into database
    const { data, error } = await supabase
      .from('product_suggestions')
      .insert({
        product_name: productName,
        product_type: productType,
        product_category: productCategory || null,
        suggested_by_user_id: userId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving product suggestion:', error);
      return NextResponse.json(
        { error: 'Failed to save suggestion' },
        { status: 500 }
      );
    }

    console.log('✅ Product suggestion saved:', {
      id: data.id,
      productName,
      productType,
      productCategory,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Suggestion submitted successfully',
      data,
    });

  } catch (error) {
    console.error('Error processing suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}
