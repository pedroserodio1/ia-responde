import { FastifyRequest, FastifyReply } from "fastify";
import { ChatService } from "./chat.service";

export class ChatController {
  static async getMessages(
    req: FastifyRequest<{ Params: { id: string }; Querystring: { limit?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const messages = await ChatService.getMessages(id, limit);
      return reply.send(messages);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to fetch messages" });
    }
  }
}
