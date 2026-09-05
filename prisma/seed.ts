import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "AI & Machine Learning", slug: "ai-ml", icon: "brain", color: "#E8734A" },
  { name: "Development Tools", slug: "dev-tools", icon: "code", color: "#3F9863" },
  { name: "Cloud & Infrastructure", slug: "cloud", icon: "cloud", color: "#4A90E8" },
  { name: "Frontend", slug: "frontend", icon: "palette", color: "#9B59B6" },
  { name: "Backend", slug: "backend", icon: "server", color: "#E67E22" },
  { name: "Data", slug: "data", icon: "database", color: "#1ABC9C" },
  { name: "Security", slug: "security", icon: "shield", color: "#C94A3F" },
  { name: "DevOps", slug: "devops", icon: "settings", color: "#95A5A6" },
  { name: "Learning", slug: "learning", icon: "book", color: "#F39C12" },
  { name: "Community", slug: "community", icon: "users", color: "#2ECC71" },
];

async function main() {
  console.log("Seeding default categories...");

  // This seed is designed to be run after a user is created.
  // It requires a userId. For now, we'll skip if no user exists.
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found. Skipping seed.");
    return;
  }

  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { userId_slug: { userId: user.id, slug: category.slug } },
      update: {},
      create: {
        userId: user.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        color: category.color,
      },
    });
  }

  console.log("Seeded default categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
