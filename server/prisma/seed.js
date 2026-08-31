require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jafashions.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'jafashions2026';
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashed, name: process.env.ADMIN_NAME || 'JA fashions Admin' },
    create: { email: adminEmail, password: hashed, name: process.env.ADMIN_NAME || 'JA fashions Admin' },
  });

  const categories = [
    { name: 'Clothes', slug: 'clothes', description: 'Dresses, jackets and everyday wear' },
    { name: 'Shoes', slug: 'shoes', description: 'Sneakers, heels and sandals' },
    { name: 'Handbags', slug: 'handbags', description: 'Mini bags and totes' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }

  console.log('Seed completed. Admin and categories ready. No mock products or pictures were seeded.');
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD ? 'configured from environment' : 'using default jafashions2026 - change before production'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
