import { FastifyInstance } from "fastify";
import { ContactController } from "./contact.controller";

export async function contactRoutes(app: FastifyInstance) {
  app.get("/", ContactController.listContacts);
  app.put("/:id", ContactController.updateContact);
}
