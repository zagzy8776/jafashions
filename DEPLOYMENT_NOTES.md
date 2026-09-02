# Deployment Notes - JA Fashions Admin Login Fix

## Problem
The admin login endpoint was returning a 500 error on production.

## Root Causes
1. **Missing Auth Endpoint**: The `/api/auth/login` endpoint didn't exist
2. **Incorrect Vercel Configuration**: vercel.json was configured for a Next.js + Prisma setup that wasn't the actual deployment
3. **Monorepo Structure Mismatch**: Project has multiple structures (React+Vite client, Next.js app, Express server) but only the React client is deployed

## Solution Implemented

### 1. Created Vercel Serverless Function
- **File**: `/api/auth/login.js`
- **Location**: Root-level API directory (Vercel standard)
- **Features**:
  - Password validation against `ADMIN_PASSWORD` env var
  - Secure token generation with HMAC-SHA256
  - HTTP-only cookie setting
  - CORS support for cross-origin requests
  - Proper error handling

### 2. Fixed Vercel Configuration
- **File**: `vercel.json`
- **Changes**:
  - Set correct `buildCommand`: `npm run build` (builds React app)
  - Set correct `outputDirectory`: `client/dist` (Vite output)
  - Added `functions` section to enable Node.js runtime for `/api/**/*.js`
  - Updated `routes` to properly handle API calls vs SPA routing

### 3. Added .vercelignore
- Excludes unnecessary directories from deployment
- Reduces deployment size and build time

## Required Environment Variables

### On Vercel Dashboard:
Set these environment variables in your Vercel project settings:

```
ADMIN_PASSWORD=jafashions2026
NODE_ENV=production
```

**Note**: If `ADMIN_PASSWORD` is not set, it defaults to `jafashions2026`

## Testing Results

Endpoint successfully tested locally:
- ✅ POST with correct password → 200 OK, returns token
- ✅ POST with wrong password → 401 Unauthorized
- ✅ POST without password → 400 Bad Request
- ✅ Non-POST requests → 405 Method Not Allowed
- ✅ OPTIONS preflight → 200 OK

## Deployment Timeline

1. Code pushed to GitHub: `main` branch
2. Vercel should automatically redeploy (usually 1-5 minutes)
3. Once deployed, endpoint available at: `https://www.jafashions.com.ng/api/auth/login`

## Verification Steps

1. **Check Vercel Deployment**:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Check "Deployments" tab for successful build

2. **Test Login**:
   - Navigate to https://www.jafashions.com.ng/admin/login
   - Enter password: `jafashions2026`
   - Click "Login Securely"
   - Should redirect to admin dashboard

3. **Check Logs** (if still failing):
   - Vercel Dashboard → Deployments → Select latest → Logs
   - Look for auth login endpoint errors

## Endpoint Details

**URL**: `POST https://www.jafashions.com.ng/api/auth/login`

**Request**:
```json
{
  "password": "jafashions2026"
}
```

**Success Response** (200):
```json
{
  "ok": true,
  "token": "admin.TIMESTAMP.SIGNATURE"
}
```

**Error Response** (401):
```json
{
  "message": "Invalid password"
}
```

## Architecture Summary

```
┌─────────────────┐
│  React Client   │ (client/)
│  (Vite Build)   │
└────────┬────────┘
         │
    API Calls
         │
┌────────▼────────┐
│  Vercel Routes  │
├─────────────────┤
│ /api/auth/login │ ← Login endpoint
│ /api/*          │ ← Other endpoints
│ /*              │ ← SPA routes
└─────────────────┘
```

## Next Steps

1. Wait for Vercel deployment to complete
2. Verify ADMIN_PASSWORD is set in Vercel environment
3. Test login at admin panel
4. If issues persist, check Vercel build logs
