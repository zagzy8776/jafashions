# JA fashions

Online store for clothes, shoes and handbags. Nigeria-based. Customers browse on the site and finish checkout on WhatsApp.

Same stack and layout as the Sumptuous Braids store: React + Vite frontend, Express API on Vercel, Neon Postgres, Cloudinary uploads.

* Store phone: +234 811 000 6486
* Email: ahmedshitu737@gmail.com
* Admin: /admin

No mock or stock product photos are bundled. Pieces and lookbook images are posted from admin with the phone camera.

## Stack

- Frontend: React + Vite + Tailwind on Vercel
- API: Express serverless function on the same Vercel project
- Database: Neon PostgreSQL (`DATABASE_URL` only)
- Images: unsigned Cloudinary upload (cloud name + upload preset)

## Vercel environment variables

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=a-long-random-secret
CLIENT_URL=https://jafashions.vercel.app
ADMIN_NAME=JA fashions Admin
ADMIN_EMAIL=admin@jafashions.com
ADMIN_PASSWORD=jafashions2026
NODE_ENV=production
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=2348110006486
VITE_CLOUDINARY_CLOUD_NAME=bbke1t9y
VITE_CLOUDINARY_UPLOAD_PRESET=Jafashion
```

In Cloudinary, the preset must be **Unsigned**.

## Local setup

```bash
cd server
cp .env.example .env
npm install --include=dev
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

```bash
cd client
cp .env.example .env
npm install --include=dev
npm run dev
```

Default admin: `admin@jafashions.com` / `jafashions2026`
