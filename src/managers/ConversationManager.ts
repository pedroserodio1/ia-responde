import { WASocket } from "baileys";
import { getRecentMessages } from "../database/functions/getRecentMessages";
import { saveMessage } from "../database/functions/saveMessage";
import { OllamaService } from "../services/OllamaService";
import logger from "../utils/pino";
import { randomUUID } from "crypto";
import { saveOrUpdateSummaryDB } from "../database/functions/upsertSummary";
import { getSummary } from "../database/functions/getSummary";

interface ContactState {
  buffer: string[];
  timeout: NodeJS.Timeout | null;
}

const log = logger.child({ module: "ConversationManager" });

export class ConversationManager {
  private static contacts = new Map<string, ContactState>();
  private static ollama = new OllamaService();

  static async handleMessage(
    sock: WASocket,
    data: { from: string; text: string; pushName: string | null; id: string },
  ) {
    const { from, text } = data;

    // Recupera ou inicializa o estado do contato
    let state = this.contacts.get(from);
    if (!state) {
      state = { buffer: [], timeout: null };
      this.contacts.set(from, state);
    }

    // Adiciona mensagem ao buffer
    state.buffer.push(text);

    // Cancela timeout anterior se existir
    if (state.timeout) {
      clearTimeout(state.timeout);
    }

    log.info(
      { from, bufferSize: state.buffer.length },
      "Mensagem adicionada ao buffer, aguardando silêncio...",
    );

    // Define novo timeout de 30 segundos
    state.timeout = setTimeout(() => {
      this.processContact(sock, from, data.pushName);
    }, 30000);
  }

  private static async processContact(
    sock: WASocket,
    contactId: string,
    pushName: string | null,
  ) {
    const state = this.contacts.get(contactId);
    if (!state || state.buffer.length === 0) return;

    const currentBuffer = [...state.buffer];
    state.buffer = [];
    state.timeout = null;
    this.contacts.delete(contactId);

    log.info(
      { contactId, msgCount: currentBuffer.length },
      "Processando mensagens acumuladas...",
    );

    try {
      // 1. Recupera histórico recente
      const history = await getRecentMessages(contactId, 20);
      const sortedHistory = history.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
      );


      // 1.5 Recupera resumo anterior
      const summary = await getSummary(contactId);

      // 2. Monta o contexto
      let context = `
Você está conversando no WhatsApp como uma pessoa comum.
Não representa empresa, suporte, clínica ou atendimento.
Fale curto, natural, informal, com gírias leves.
Não use listas nem explique nada.
Responda como alguém responderia de verdade.
REGRAS RÍGIDAS:
- escreva sempre em letra minúscula.
- não use emojis.

`;

      if (summary) {
        context += `\nResumo do que já conversaram antes (IMPORTANTE):\n${summary}\n`;
      }

      context += `
Conversa recente:
`;
      for (const msg of sortedHistory) {
        const prefix = msg.fromMe ? "Você" : "Pessoa";
        context += `${prefix}: ${msg.text}\n`;
      }

      context += "\nMensagens novas:\n";
      for (const msg of currentBuffer) {
        context += `Pessoa: ${msg}\n`;
      }
      context += "\nSua resposta (como pessoa real, no WhatsApp):\n";

      log.info({ context }, "Enviando contexto para IA...");
      const responseText = await this.ollama.generateResponse(context);

      if (!responseText || responseText.trim().length === 0) {
        log.warn({ contactId }, "Resposta vazia da IA, ignorando envio");
        return;
      }

      // --- SIMULAÇÃO HUMANA ---
      // 1. Começa a digitar
      await sock.sendPresenceUpdate("composing", contactId);

      // 2. Espera um tempo proporcional ao tamanho da resposta
      const words = responseText.split(/\s+/).length;
      const typingTime = Math.min(Math.max(words * 300, 1000), 12000);
      await new Promise((res) => setTimeout(res, typingTime));

      // 3. Pausa antes de enviar
      await sock.sendPresenceUpdate("paused", contactId);
      await new Promise((res) => setTimeout(res, 500 + Math.random() * 1500));

      // 4. Envia a resposta
      await sock.sendMessage(contactId, { text: responseText });

      // 6. Salva resposta no banco
      await saveMessage({
        id: randomUUID(),
        from: contactId,
        text: responseText,
        fromMe: true,
        timestamp: Date.now(),
        pushName: pushName,
      });

      this.updateSummary(contactId);

      log.info({ contactId }, "Resposta enviada e salva com sucesso.");
    } catch (error: any) {
      log.error(
        { err: error.message, contactId },
        "Erro ao processar conversa",
      );
    }
  }

  static async updateSummary(contactId: string) {
  // 1. Pega as últimas 50 mensagens, ou o quanto achar relevante
  const messages = await getRecentMessages(contactId, 30);

  if (!messages.length) return;

  // 2. Monta texto bruto pra resumir
  const text = messages
    .map(msg => (msg.fromMe ? "Você: " : "Pessoa: ") + msg.text)
    .join("\n");

    log.info({text}, "Gerando resumo da conversa via IA...");
  // 3. Gera resumo via IA
  const summary = await this.ollama.generateResponse(
    `Resuma de forma curta e informal esta conversa:\n\n${text}`
  );

  if (!summary || summary.trim().length === 0) return;

  // 4. Salva no banco
  // Se já existir um resumo pro período mais recente, atualiza
  const now = new Date();
  await saveOrUpdateSummaryDB(
    contactId,
    summary,
    messages[0].timestamp,
    now
  )

  log.info({ contactId }, "Resumo atualizado com sucesso");
}
}
