import prisma from "../prisma";

export async function getRecentMessages(contactId: string, limit: number = 20) {
  return prisma.message.findMany({
    where: { contactId },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}
