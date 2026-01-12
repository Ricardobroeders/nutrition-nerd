import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      const error = await resendResponse.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion sent successfully'
    });

  } catch (error) {
    console.error('Error processing suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}
