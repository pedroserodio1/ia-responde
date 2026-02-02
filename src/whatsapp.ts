import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState
} from 'baileys'

import QRCode from 'qrcode'
import logger from './utils/pino'
import normalizeMessage from './utils/normalize-message'
import { saveMessage } from './database/functions/saveMessage'
import { ConversationManager } from './managers/ConversationManager'

const log = logger.child({ module: 'whatsapp' })

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')

    const sock = makeWASocket({
        logger: log,
        auth: state,
        markOnlineOnConnect: false,
        shouldSyncHistoryMessage: () => false
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            console.log(
                await QRCode.toString(qr, { type: 'terminal', small: true })
            )
        }

        if (connection === 'open') {
            log.info('conectado com sucesso')
        }

        if (connection === 'close') {
            const reason = (lastDisconnect?.error as any)?.output?.statusCode

            log.warn({ reason }, 'connection closed')

            if (reason !== DisconnectReason.loggedOut) {
                startSock()
            } else {
                log.error('logout detectado, apagar auth e parear de novo')
            }
        }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return

        const msg = messages[0]

        const data = normalizeMessage(msg)

        if (!data) return

        if (data.isGroup) return
        if (data.isChannel) return
        if (data.isEvent) return

        if (!data.id || !data.from || !data.text) return

        await saveMessage({
            id: data.id,
            from: data.from,
            text: data.text,
            fromMe: data.fromMe ?? false,
            timestamp: data.timestamp,
            pushName: data.pushName,
        })

        log.info({ from: data.from, text: data.text }, 'mensagem salva')

        if(data.fromMe) return
        await ConversationManager.handleMessage(sock, {
            from: data.from,
            text: data.text,
            pushName: data.pushName,
            id: data.id
        })
    })
}

startSock()
