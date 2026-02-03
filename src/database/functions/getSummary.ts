import { prisma } from "../prisma";

export async function getSummary(contactId: string): Promise<string | null> {
  const summary = await prisma.summary.findUnique({
    where: { contactId },
  });

  return summary?.content || null;
}
