# 🔑 OpenAI API Key Setup Guide

## Current Issue
The API key is being detected but OpenAI is returning a 404 error, which typically means:
- The API key is expired or invalid
- The API key doesn't have access to the requested model
- There's a billing/quota issue

## How to Get a Working OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account

### Step 2: Add Billing Information
1. Go to [Billing Settings](https://platform.openai.com/account/billing)
2. Add a payment method (required for API access)
3. Add at least $5-10 credit to your account

### Step 3: Create API Key
1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Step 4: Update the Code
Replace the API key in `src/utils/aiService.ts`:

```typescript
private static openaiApiKey = 'sk-your-new-working-api-key-here';
```

## Test Your API Key

You can test if your API key works by running this in browser console:

```javascript
fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 10
  })
}).then(r => r.json()).then(console.log);
```

## Alternative: Use Mock AI for Demo

If you want to demonstrate the system without OpenAI costs, I can create a realistic mock AI that simulates GPT responses for demo purposes.

## Current Status
- ✅ API key detection working
- ✅ Request format correct  
- ❌ API key authentication failing (404 error)
- ✅ Fallback to keyword matching working

The system is working correctly - it just needs a valid OpenAI API key to use real AI evaluation instead of the keyword fallback.