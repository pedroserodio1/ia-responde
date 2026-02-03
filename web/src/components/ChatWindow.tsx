import { useState, useEffect, useRef } from 'react';
import { Bot, User, Edit2 } from 'lucide-react';
import { api, type Message, type Contact } from '../services/api';
import './ChatWindow.css';

interface ChatWindowProps {
    contact: Contact | null;
    onEditContact?: () => void;
}

export function ChatWindow({ contact, onEditContact }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contact) return;
        setLoading(true);
        api.get<Message[]>(`/contacts/${contact.id}/messages`)
            .then(res => {
                // Cria cópia e ordena por createdAt (mais antigo primeiro)
                const sorted = [...res.data].sort((a, b) => {
                    const timeA = new Date(a.createdAt).getTime();
                    const timeB = new Date(b.createdAt).getTime();
                    return timeA - timeB;
                });
                setMessages(sorted);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [contact]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!contact) {
        return (
            <div className="chat-window chat-window--empty">
                <div className="chat-window__placeholder">
                    <Bot size={64} strokeWidth={1.5} />
                    <h2>Selecione uma conversa</h2>
                    <p>Escolha um contato na lista para ver as mensagens</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <header className="chat-window__header glass">
                <div className="chat-window__avatar">
                    {(contact.pushName || contact.id).charAt(0).toUpperCase()}
                </div>
                <div className="chat-window__contact-info">
                    <span className="chat-window__name">{contact.pushName || contact.id.split('@')[0]}</span>
                    <span className="chat-window__status">Online</span>
                </div>
                {onEditContact && (
                    <button className="chat-window__edit" onClick={onEditContact}>
                        <Edit2 size={18} />
                    </button>
                )}
            </header>

            <div className="chat-window__messages">
                {loading ? (
                    <div className="chat-window__loading">Carregando mensagens...</div>
                ) : messages.length === 0 ? (
                    <div className="chat-window__no-messages">Nenhuma mensagem ainda</div>
                ) : (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`message ${msg.fromMe ? 'message--sent' : 'message--received'}`}
                        >
                            <div className="message__icon">
                                {msg.fromMe ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="message__bubble">
                                <p className="message__text">{msg.text}</p>
                                <span className="message__time">
                                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
