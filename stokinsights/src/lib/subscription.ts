import { prisma } from "@/lib/prisma";

export async function getSubscriptionStatus(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  return sub?.status ?? "none";
}

export async function isPro(userId: string) {
  return (await getSubscriptionStatus(userId)) === "active";
}
