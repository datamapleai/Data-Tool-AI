import { db } from "./db";

export async function isInstalled(): Promise<boolean> {
  const config = await db.appConfig.findUnique({ where: { id: "singleton" } });
  return config !== null && config.installedAt !== null;
}

export async function markInstalled(): Promise<void> {
  await db.appConfig.upsert({
    where: { id: "singleton" },
    update: { installedAt: new Date() },
    create: { id: "singleton", installedAt: new Date() },
  });
}

export async function canCreateAdmin(): Promise<boolean> {
  const userCount = await db.user.count();
  return userCount === 0;
}
