import { prisma } from "../prisma";

export async function saveOrUpdateSummaryDB(
  contactId: string,
  content: string,
  fromDate: Date,
  toDate: Date
) {
  if (!content || !content.trim()) return;

  await prisma.summary.upsert({
    where: { contactId }, // precisa ser unique no schema ou criar lógica alternativa
    update: {
      content,
      toDate,
    },
    create: {
      contactId,
      content,
      fromDate,
      toDate,
    },
  });
}
