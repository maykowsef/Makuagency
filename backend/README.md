# CRM Backend Deployment

## Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

```
DATABASE_URL=postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres
NODE_ENV=production
SUPABASE_ANON_KEY=sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD
SUPABASE_URL=https://snswadioooqitikqmxjl.supabase.co
```

**Frontend Environment Variable:**
```
REACT_APP_API_URL=https://makuagencybackendproject.vercel.app/api
```

## Deployment Steps

1. Push this backend to GitHub
2. Connect repository to Vercel
3. Add environment variables above
4. Deploy

## API Endpoints

- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

- `GET /api/selling-points` - Get all selling points
- `POST /api/selling-points` - Create selling point
- `PUT /api/selling-points/:id` - Update selling point
- `DELETE /api/selling-points/:id` - Delete selling point
