# 🤖 IA Responde

**Este projeto tem foco no aprendizado e estudo de tecnologias.**

O **IA Responde** é um bot de WhatsApp desenvolvido para experimentar e aprender sobre a integração de APIs de mensagens com Inteligência Artificial local. O projeto utiliza o **Ollama** para processamento de linguagem natural e o **Baileys** para conexão com o WhatsApp.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack moderna e robusta:

- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para um código mais seguro e escalável.
- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript.
- **[Baileys](https://github.com/WhiskeySockets/Baileys)**: Biblioteca para integração com o WhatsApp Web API.
- **[Ollama](https://ollama.com/)**: Execução de LLMs (Large Language Models) localmente.
- **[Prisma](https://www.prisma.io/)**: ORM moderno para interação com banco de dados.
- **[SQLite](https://www.sqlite.org/)**: Banco de dados leve e eficiente (via `better-sqlite3`).
- **[Pino](https://github.com/pinojs/pino)**: Logger de alta performance.

## 📚 Como Funciona

O bot intercepta mensagens recebidas no WhatsApp, mantém um contexto da conversa e utiliza um modelo de IA rodando no Ollama para gerar respostas inteligentes. Ele foi desenhado para lidar com debouncing de mensagens (esperar o usuário terminar de digitar) e manter histórico de conversas.

## 🛠️ Configuração e Instalação

### Pré-requisitos
- **Node.js** (versão 20 ou superior recomendada)
- **Ollama** instalado e rodando com um modelo baixado (ex: `llama3`, `mistral`).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd ia-responde
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configure o Banco de Dados:**
   O projeto usa Prisma com SQLite. Execute as migrações para criar o arquivo do banco de dados (`dev.db`):
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Variáveis de Ambiente:**
   Certifique-se de configurar o arquivo `.env` com as informações necessárias (se aplicável, como URL do banco ou configurações do Ollama).

5. **Execute o Projeto:**
   Para rodar em modo de desenvolvimento (com hot-reload):
   ```bash
   npm run dev
   ```
   Para rodar em produção:
   ```bash
   npm run build
   npm run start:prod
   ```

6. **Conecte ao WhatsApp:**
   Ao iniciar, o terminal exibirá um **QR Code**. Escaneie-o com o aplicativo do WhatsApp (Dispositivos Conectados > Conectar Aparelho) para autenticar o bot.

## 📝 Objetivo do Projeto

O objetivo principal deste repositório é servir como base de estudos para:
- Arquitetura de bots conversacionais.
- Integração de sistemas síncronos (mensagens) com assíncronos (IA).
- Uso de TypeScript em projetos Node.js backend.
- Manipulação de dados com Prisma ORM.

---
*Projeto desenvolvido para fins educacionais.*
