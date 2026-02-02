import prisma from "../prisma";

export async function upsertContact(jid: string, pushName: string | null) {
  return prisma.contact.upsert({
    where: { id: jid },
    update: pushName ? { pushName } : {},
    create: {
      id: jid,
      pushName: pushName || '',
    },
  })
}
