import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * بذرة أولية للتطوير المحلي فقط — تنشئ مستخدمًا إداريًا واحدًا.
 * لا تُنشئ أي محتوى؛ نماذج المحتوى غير موجودة بعد في هذه المرحلة.
 *
 * Local-development seed only — creates a single admin user.
 * Creates no content; content models don't exist yet at this phase.
 */
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Platform Admin",
      role: "ADMIN",
    },
  });

  console.log("✅ Seeded admin user:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
