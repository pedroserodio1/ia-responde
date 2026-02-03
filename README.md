# 🤖 IA Responde

**Este projeto tem foco no aprendizado e estudo de tecnologias.**

O **IA Responde** é um bot de WhatsApp desenvolvido para experimentar e aprender sobre a integração de APIs de mensagens com Inteligência Artificial local. O projeto utiliza o **Ollama** para processamento de linguagem natural e o **Baileys** para conexão com o WhatsApp.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack moderna e robusta:

### Backend
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para um código mais seguro e escalável.
- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript.
- **[Baileys](https://github.com/WhiskeySockets/Baileys)**: Biblioteca para integração com o WhatsApp Web API.
- **[Ollama](https://ollama.com/)**: Execução de LLMs (Large Language Models) localmente.
- **[Fastify](https://www.fastify.io/)**: Framework web de alta performance para a API REST.
- **[Prisma](https://www.prisma.io/)**: ORM moderno para interação com banco de dados.
- **[SQLite](https://www.sqlite.org/)**: Banco de dados leve e eficiente (via `better-sqlite3`).
- **[Pino](https://github.com/pinojs/pino)**: Logger de alta performance.

### Frontend
- **[React](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
- **[Vite](https://vitejs.dev/)**: Build tool moderno e rápido.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para chamadas à API.
- **[Lucide React](https://lucide.dev/)**: Ícones modernos para a interface.

### DevOps & Testes
- **[Vitest](https://vitest.dev/)**: Framework de testes E2E.
- **[GitHub Actions](https://github.com/features/actions)**: CI/CD automatizado.
- **[Husky](https://typicode.github.io/husky/)**: Git hooks para garantir qualidade do código.

## 📚 Como Funciona

O bot intercepta mensagens recebidas no WhatsApp, mantém um contexto da conversa e utiliza um modelo de IA rodando no Ollama para gerar respostas inteligentes. Ele foi desenhado para lidar com debouncing de mensagens (esperar o usuário terminar de digitar) e manter histórico de conversas.

### 🔌 API REST

O projeto inclui uma API REST modular construída com Fastify, organizada em módulos:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/contacts` | GET | Lista todos os contatos |
| `/contacts/:id` | GET | Obtém um contato específico |
| `/contacts/:id` | PUT | Atualiza um contato |
| `/contacts/:id/messages` | GET | Lista mensagens de um contato |
| `/contacts/:id/summary` | GET | Obtém o resumo da conversa gerado pela IA |

### 🖥️ Interface Web

O projeto possui uma interface web moderna em React para visualização e gerenciamento das conversas:

- **Sidebar**: Lista de contatos com busca
- **ChatWindow**: Visualização do histórico de mensagens
- **SummaryPanel**: Exibição do resumo gerado pela IA
- **ContactEditModal**: Edição de informações do contato

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
   cd web && npm install && cd ..
   ```

3. **Configure o Banco de Dados:**
   O projeto usa Prisma com SQLite. Execute as migrações para criar o arquivo do banco de dados (`dev.db`):
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Variáveis de Ambiente:**
   Certifique-se de configurar o arquivo `.env` com as informações necessárias (se aplicável, como URL do banco ou configurações do Ollama).

5. **Execute o Projeto:**

   **Bot do WhatsApp (modo desenvolvimento):**
   ```bash
   npm run dev
   ```

   **API REST:**
   ```bash
   npm run api
   ```

   **Frontend Web:**
   ```bash
   npm run web
   ```

   **Tudo junto (Bot + API):**
   ```bash
   npm run start:all
   ```

   **Produção:**
   ```bash
   npm run build
   npm run start:prod
   ```

6. **Conecte ao WhatsApp:**
   Ao iniciar, o terminal exibirá um **QR Code**. Escaneie-o com o aplicativo do WhatsApp (Dispositivos Conectados > Conectar Aparelho) para autenticar o bot.

## 🧪 Testes

O projeto inclui testes E2E para validar o funcionamento da API:

```bash
npm run test:e2e
```

## 🔄 CI/CD

O projeto possui um pipeline de CI/CD configurado com GitHub Actions que:

1. **Instala dependências** (com cache do npm)
2. **Executa testes E2E** automaticamente
3. **Realiza o build** do projeto

O pipeline é acionado em pushes e pull requests para as branches `main` e `master`.

## 📂 Estrutura do Projeto

```
ia-responde/
├── src/
│   ├── api/                # API REST (Fastify)
│   │   ├── modules/
│   │   │   ├── chat/       # Módulo de mensagens
│   │   │   ├── contact/    # Módulo de contatos
│   │   │   └── summary/    # Módulo de resumos
│   │   └── server.ts
│   ├── database/           # Repositórios e acesso a dados
│   ├── managers/           # Gerenciadores (ex: ConversationManager)
│   ├── services/           # Serviços externos (ex: Ollama)
│   ├── utils/              # Utilitários
│   └── whatsapp.ts         # Conexão com WhatsApp
├── web/                    # Frontend React
│   └── src/
│       ├── components/     # Componentes React
│       └── services/       # Serviços (API client)
├── test/                   # Testes E2E
├── prisma/                 # Schema e migrações do banco
└── .github/workflows/      # CI/CD Pipeline
```

## 📝 Objetivo do Projeto

O objetivo principal deste repositório é servir como base de estudos para:
- Arquitetura de bots conversacionais.
- Integração de sistemas síncronos (mensagens) com assíncronos (IA).
- Uso de TypeScript em projetos Node.js backend.
- Manipulação de dados com Prisma ORM.
- Desenvolvimento de APIs REST com Fastify.
- Interfaces modernas com React e Vite.
- Automação de CI/CD com GitHub Actions.
- Testes E2E com Vitest.

---
*Projeto desenvolvido para fins educacionais.*
