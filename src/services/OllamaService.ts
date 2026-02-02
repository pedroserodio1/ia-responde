import axios from 'axios';
import logger from '../utils/pino';

const log = logger.child({ module: 'OllamaService' });

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(
    baseUrl: string = 'http://localhost:11434',
    model: string = 'qwen2.5:7b'
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      log.info({ model: this.model }, 'Enviando prompt para o Ollama');

      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.4,      // mais estável
            top_p: 0.9,
            num_predict: 200       // evita textão
          }
        }
      );

      const text = response?.data?.response?.trim();

      if (!text) {
        throw new Error('Resposta vazia do Ollama');
      }

      return text;

    } catch (error: any) {
      log.error({ err: error.message }, 'Erro ao consultar Ollama');

      // fallback mais humano
      return 'Tive um probleminha aqui, pode repetir?';
    }
  }
}