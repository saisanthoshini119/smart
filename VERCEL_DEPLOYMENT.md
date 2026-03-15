# Vercel Deployment Instructions

This project is configured for deployment on Vercel with the following setup:

## Files Added for Vercel Deployment

1. **`vercel.json`** - Vercel configuration file that:
   - Uses the Node.js runtime (`@vercel/node`)
   - Routes API requests to your backend
   - Serves the React application for all other routes

2. **`server.js`** - Express server that:
   - Serves static files from the `build` directory
   - Handles React Router routing
   - Runs on the port specified by Vercel

## Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the `vercel.json` configuration
   - The deployment will use the `server.js` file as the entry point

3. **Environment Variables:**
   Make sure to set any required environment variables in your Vercel project settings:
   - Your backend API URL
   - Any other environment-specific configurations

## How It Works

- The `vercel.json` configuration tells Vercel to use the Node.js runtime
- The `server.js` file serves your built React application
- React Router routes are handled properly with the catch-all route
- API requests are routed to your backend server

## Testing Locally

You can test the deployment configuration locally by running:
```bash
node server.js
```

The application will be available at `http://localhost:3000`

## Troubleshooting

If you encounter issues:
1. Make sure the `build` directory exists (run `npm run build`)
2. Check that all required dependencies are in `package.json`
3. Verify your environment variables are set correctly in Vercel
4. Check the Vercel deployment logs for any errors