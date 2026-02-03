import { prisma } from "../../../database/prisma";

export class ChatService {
  static async getMessages(contactId: string, limit: number = 50) {
    return prisma.message.findMany({
      where: { contactId },
      orderBy: { timestamp: "asc" },
      take: Number(limit), // Garante que seja número
    });
  }
}
