import { prisma } from "../../../database/prisma";

export class SummaryService {
  static async getSummary(contactId: string) {
    return prisma.summary.findUnique({
      where: { contactId },
    });
  }
}
