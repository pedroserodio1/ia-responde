import { prisma } from "../../../database/prisma";

export class ContactService {
  static async getAllContacts() {
    return prisma.contact.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }

  static async updateContact(id: string, data: { pushName?: string }) {
    return prisma.contact.update({
      where: { id },
      data,
    });
  }
}
