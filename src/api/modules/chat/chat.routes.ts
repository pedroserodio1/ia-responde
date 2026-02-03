import { FastifyInstance } from "fastify";
import { ChatController } from "./chat.controller";

export async function chatRoutes(app: FastifyInstance) {
  // Rota será montada em /contacts/:id/messages
  // Como o prefixo pai é /contacts, precisamos definir o resto aqui?
  // No server.ts: app.register(chatRoutes, { prefix: "/contacts" });
  // Então aqui a rota deve ser /:id/messages
  app.get("/:id/messages", ChatController.getMessages);
}
