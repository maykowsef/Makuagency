# Environment Variables Setup

## 🚀 Project Names
- **Backend**: `makubackend.vercel.app`
- **Frontend**: `makufrontend.vercel.app`

## 📋 Backend Environment Variables (makubackend)

Add these in Vercel Dashboard → `makubackend` → Settings → Environment Variables:

```env
# Supabase Configuration
SUPABASE_URL=https://snswadioooqitikqmxjl.supabase.co
SUPABASE_ANON_KEY=sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD

# Database Connection (Alternative)
DATABASE_URL=postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres

# Node Configuration
NODE_ENV=production
```

## 📋 Frontend Environment Variables (makufrontend)

Add these in Vercel Dashboard → `makufrontend` → Settings → Environment Variables:

```env
# Backend API URL
REACT_APP_API_URL=https://makubackend.vercel.app/api

# Optional: Override hardcoded values (not needed but recommended)
REACT_APP_BACKEND_URL=https://makubackend.vercel.app
```

## 🗄️ Database Setup

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project: `snswadioooqitikqmxjl`
3. Go to **SQL Editor** → **New query**
4. Copy and run the entire `database-setup.sql` file
5. This will create all required tables:
   - `companies`
   - `contacts`
   - `selling_points`
   - `activities`
   - `assignments`
   - `minisites`
   - `schedules`
   - `inventory`

## 🧪 Testing URLs

### Backend Endpoints
- **Root**: https://makubackend.vercel.app/
- **Test**: https://makubackend.vercel.app/api/test
- **Selling Points**: https://makubackend.vercel.app/api/selling-points

### Frontend
- **Main App**: https://makufrontend.vercel.app/

## 🔧 Verification

After deployment, test in browser console:

```javascript
// Test backend
fetch('https://makubackend.vercel.app/api/test')
  .then(r => r.json())
  .then(console.log);

// Test selling points
fetch('https://makubackend.vercel.app/api/selling-points')
  .then(r => r.json())
  .then(console.log);
```

## 🚨 Important Notes

1. **Backend URL**: All API calls now go to `https://makubackend.vercel.app/api`
2. **Frontend URL**: The frontend is deployed at `https://makufrontend.vercel.app`
3. **Environment Variables**: Must be set in each Vercel project separately
4. **Database**: Tables must be created in Supabase before testing CRUD operations
