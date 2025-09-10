# 🚀 Deployment Guide - Inventory Management System

## Quick Deployment Options

Your application is ready to deploy! Here are the steps for each platform:

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps:
1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables in Vercel:**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add these variables:
     ```
     SUPABASE_URL=https://ebdxjqzmkxwpviivxkpo.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZHhqcXpta3h3cHZpaXZ4a3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTA5MjAsImV4cCI6MjA3Mjk2NjkyMH0.NZr29DLw9gZt_5LE_LckaeGzseXpPq0npBrMbdYDax4
     AZURE_DATABASE_URL=your_azure_database_connection_string
     PORT=4000
     ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be live in minutes!

## Option 2: Deploy to Netlify

### Steps:
1. **Create netlify.toml file** (already created)
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `build`

4. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add the same variables as above

## Option 3: Deploy to Railway

### Steps:
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables:**
   ```bash
   railway variables set SUPABASE_URL=https://ebdxjqzmkxwpviivxkpo.supabase.co
   railway variables set SUPABASE_ANON_KEY=your_key_here
   railway variables set AZURE_DATABASE_URL=your_database_url
   ```

## Option 4: Deploy to Render

### Steps:
1. **Create render.yaml** (already created)
2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New Web Service"
   - Connect your repository

3. **Configure Service:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables in dashboard

## Important Notes

### Environment Variables Required:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `AZURE_DATABASE_URL`: Your Azure PostgreSQL connection string
- `PORT`: Server port (usually 4000)

### Before Deployment:
1. **Test locally:**
   ```bash
   cd ims
   npm install
   npm run build
   npm start
   ```

2. **Verify your Azure database is accessible** from the internet

3. **Check Supabase configuration** is correct

### After Deployment:
1. **Test your API endpoints:**
   - `https://your-app.vercel.app/api/test`
   - `https://your-app.vercel.app/api/inventory` (with auth)

2. **Verify authentication works** with your deployed frontend

## Troubleshooting

### Common Issues:
1. **Database connection errors:** Check your Azure database firewall settings
2. **CORS errors:** Ensure your backend allows requests from your frontend domain
3. **Environment variables:** Double-check all variables are set correctly

### Support:
- Check deployment platform logs for specific errors
- Verify all environment variables are set
- Test API endpoints individually

## Your App is Ready! 🎉

Your inventory management system is fully configured and ready to deploy. Choose any of the options above and you'll have a live web service in minutes!
