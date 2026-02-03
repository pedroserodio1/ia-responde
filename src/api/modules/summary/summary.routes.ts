import { FastifyInstance } from "fastify";
import { SummaryController } from "./summary.controller";

export async function summaryRoutes(app: FastifyInstance) {
  app.get("/:id/summary", SummaryController.getSummary);
}
