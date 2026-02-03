import { FastifyRequest, FastifyReply } from "fastify";
import { ContactService } from "./contact.service";

export class ContactController {
  static async listContacts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const contacts = await ContactService.getAllContacts();
      return reply.send(contacts);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to fetch contacts" });
    }
  }

  static async updateContact(
    req: FastifyRequest<{ Params: { id: string }; Body: { pushName?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { pushName } = req.body;
      const contact = await ContactService.updateContact(id, { pushName });
      return reply.send(contact);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to update contact" });
    }
  }
}
