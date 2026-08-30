# JA fashions

Online store for **clothes, shoes and handbags**. Nigeria-based. Customers browse on the site and finish checkout on WhatsApp.

- Store phone: `+234 811 000 6486`
- Email: `ahmedshitu737@gmail.com`
- Admin: `/admin` (phone-friendly product posting + Cloudinary photos)

## Stack

- Next.js App Router
- Neon Postgres (`soft-wave-10740409` · org `org-falling-haze-84504714`)
- Drizzle + `@neondatabase/serverless`
- Cloudinary unsigned uploads from the admin phone camera

## Local setup

```bash
npm install
cp .env.example .env.local
# paste DATABASE_URL
npm run db:setup
npm run dev
```

Open http://localhost:3000

Admin default password is `jafashions2026` until you change `ADMIN_PASSWORD`.

## Neon

Project is linked in `.neon`.

```
orgId: org-falling-haze-84504714
projectId: soft-wave-10740409
```

Pooled URL goes in `DATABASE_URL`. Direct URL (no `-pooler`) goes in `DATABASE_URL_UNPOOLED` for schema work.

```bash
npx neon@latest profile list
npx neon@latest link --org-id org-falling-haze-84504714 --project-id soft-wave-10740409
npx neon@latest env pull --file .env.local
```

## Cloudinary

Unsigned uploads. Only cloud name + preset are required:

- `CLOUDINARY_CLOUD_NAME=bbke1t9y`
- `CLOUDINARY_UPLOAD_PRESET=Jafashion`

Admin → Add product → camera / gallery on your phone. No API key needed.

## Deploy

Push to GitHub and import the repo on Vercel. Add the same env vars in the Vercel project settings.
