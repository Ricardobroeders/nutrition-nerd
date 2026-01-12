# Email Setup for Product Suggestions

The product suggestions feature uses [Resend](https://resend.com) to send emails to `info@ricardobroeders.nl`.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### 2. Get Your API Key

1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Nutrition Nerd - Product Suggestions")
4. Select "Sending access" permission
5. Click "Create"
6. Copy the API key (it will only be shown once!)

### 3. Configure Environment Variable

Add the API key to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_api_key_here
```

### 4. Verify Domain (Production Only)

For production deployment, you need to verify your domain:

1. Go to [Domains](https://resend.com/domains) in Resend
2. Click "Add Domain"
3. Enter your domain (e.g., `nutritionnerd.app`)
4. Follow the instructions to add DNS records
5. Wait for verification (usually takes a few minutes)

Once verified, update the API route to use your domain:

```typescript
from: 'Nutrition Nerd <noreply@nutritionnerd.app>',
```

### 5. Development Mode

For development, Resend allows you to send emails without domain verification to:
- The email address you signed up with
- Any email address if you're on a paid plan

If `RESEND_API_KEY` is not set, the API will log suggestions to the console instead of sending emails.

## Testing

1. Run the app: `npm run dev`
2. Navigate to the "Suggesties" page
3. Fill out the form and submit
4. Check the console logs or your email inbox

## Troubleshooting

### Email not being sent

- Check that `RESEND_API_KEY` is set in `.env.local`
- Verify the API key is correct
- Check the API route logs in the terminal
- For production: ensure your domain is verified

### Email goes to spam

- Make sure you've verified your domain
- Add SPF and DKIM records (Resend provides these)
- Consider using a custom domain for the `from` address

## Cost

Resend offers:
- **Free tier**: 3,000 emails/month
- **Pro tier**: $20/month for 50,000 emails

The free tier should be more than sufficient for product suggestions.

## Alternative: Webhook to Slack/Discord

If you prefer not to use email, you can modify the API route to send notifications to Slack or Discord instead. See the Resend documentation for webhook examples.
