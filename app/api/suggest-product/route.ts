import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
    const { productName, productType, productCategory, userEmail } = body;

    // Validate required fields
    if (!productName || !productType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailSubject = `Nieuwe Product Suggestie: ${productName}`;
    const emailBody = `
Nieuwe product suggestie ontvangen via Nutrition Nerd app!

Product Details:
- Naam: ${productName}
- Type: ${productType === 'fruit' ? '🍎 Fruit' : '🥦 Groente'}
- Categorie: ${productCategory || 'Geen categorie'}

Ingediend door: ${userEmail}

---
Dit bericht is automatisch gegenereerd via de Nutrition Nerd app.
    `.trim();

    // Send email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      // For development: just log the suggestion
      console.log('Product suggestion:', { productName, productType, productCategory, userEmail });
      return NextResponse.json({
        success: true,
        message: 'Suggestion logged (email not configured)'
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Nutrition Nerd <noreply@nutritionnerd.app>',
        to: ['info@ricardobroeders.nl'],
        subject: emailSubject,
        text: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', errorText);

      // If domain not verified, log suggestion and return success
      // This allows the app to work while domain verification is pending
      if (errorText.includes('domain is not verified')) {
        console.log('📧 Product Suggestion (logged - domain not verified):', {
          productName,
          productType,
          productCategory,
          userEmail,
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          message: 'Suggestion received and logged'
        });
      }

      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion sent successfully'
    });

  } catch (error) {
    console.error('Error processing suggestion:', error);

    // Fallback: Log the suggestion so it's not lost
    console.log('📧 Product Suggestion (logged due to error):', {
      productName: body.productName,
      productType: body.productType,
      productCategory: body.productCategory,
      userEmail: body.userEmail,
      timestamp: new Date().toISOString()
    });

    // Return success to user even if email fails
    // Suggestions are logged and can be retrieved from Vercel logs
    return NextResponse.json({
      success: true,
      message: 'Suggestion received and logged'
    });
  }
}
