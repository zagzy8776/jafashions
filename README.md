# JA fashions

Online store for **clothes, shoes and handbags**. Nigeria-based. Customers browse on the site and finish checkout on WhatsApp.

- Store phone: `+234 811 000 6486`
- Email: `ahmedshitu737@gmail.com`
- Admin: `/admin` (phone-friendly product posting + Cloudinary photos)

## Stack

- Next.js App Router
- Neon Postgres (`soft-wave-10740409` · org `org-falling-haze-84504714`)
- Drizzle + `@neondatabase/serverless`
- Cloudinary uploads from the admin phone camera

## Local setup

```bash
npm install
cp .env.example .env.local
# paste DATABASE_URL and Cloudinary keys
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

Create a cloud, then add:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Admin → Add product → camera / gallery. Images land in the `jafashions` folder.

## Deploy

Push to GitHub and import the repo on Vercel. Add the same env vars in the Vercel project settings.
