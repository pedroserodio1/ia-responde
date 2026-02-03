import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { contactRoutes } from "./modules/contact/contact.routes";
import { chatRoutes } from "./modules/chat/chat.routes";
import { summaryRoutes } from "./modules/summary/summary.routes";
import logger from "../utils/pino";

export const app = Fastify({
  logger: false, // Usaremos nosso próprio logger
});

app.register(cors, {
  origin: "*", // Ajuste conforme necessário para segurança
});

app.register(formbody);

// Register Routes
app.register(contactRoutes, { prefix: "/contacts" });
app.register(chatRoutes, { prefix: "/contacts" }); // Nested: /contacts/:id/messages
app.register(summaryRoutes, { prefix: "/contacts" }); // Nested: /contacts/:id/summary

const start = async () => {
  try {
    const port = 3000;
    await app.listen({ port, host: "0.0.0.0" });
    logger.info(`Server listening on http://localhost:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

