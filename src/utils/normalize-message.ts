import { WAMessage } from 'baileys'
import { MessageDTO } from '../dtos/MessageDTO'

export default function normalizeMessage(msg: WAMessage): MessageDTO | null {
    if (!msg.key.remoteJid) return null

    const fromMe = msg.key.fromMe ?? false
    const remoteJid = msg.key.remoteJid
    const participant = msg.key.participant

    const isGroup = remoteJid.endsWith('@g.us')
    const isChannel = remoteJid.endsWith('@newsletter')
    const isEvent =
        remoteJid === 'status@broadcast' ||
        (!msg.message && !msg.messageStubType)

    let contactId = remoteJid
    if (!fromMe) {
        if (isGroup && participant) {
            contactId = participant
        }
    }

    const message = msg.message

    if (!message) return null

    const text =
        message.conversation ||
        message.extendedTextMessage?.text ||
        message.imageMessage?.caption ||
        message.videoMessage?.caption ||
        null


    return {
        id: msg.key.id,
        from: contactId,
        fromMe,
        isGroup,
        isChannel,
        isEvent,
        pushName: fromMe ? null : (msg.pushName ?? null),
        text,
        timestamp: Number(msg.messageTimestamp) * 1000,
    }
}
