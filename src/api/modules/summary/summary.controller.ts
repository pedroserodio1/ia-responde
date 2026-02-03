import { FastifyRequest, FastifyReply } from "fastify";
import { SummaryService } from "./summary.service";

export class SummaryController {
  static async getSummary(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const summary = await SummaryService.getSummary(id);
      if (!summary) return reply.status(404).send({ error: "Summary not found" });
      return reply.send(summary);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to fetch summary" });
    }
  }
}
