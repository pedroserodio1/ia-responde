import { useState, useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { api, type Contact } from '../services/api';
import './Sidebar.css';

interface SidebarProps {
    onSelectContact: (contact: Contact) => void;
    selectedContactId?: string;
}

export function Sidebar({ onSelectContact, selectedContactId }: SidebarProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Contact[]>('/contacts')
            .then(res => setContacts(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = contacts.filter(c =>
        (c.pushName || c.id).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="sidebar">
            <header className="sidebar__header">
                <h1 className="sidebar__title">
                    <MessageCircle size={24} />
                    Conversas
                </h1>
                <div className="sidebar__search">
                    <Search size={18} className="sidebar__search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar contato..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="sidebar__search-input"
                    />
                </div>
            </header>

            <div className="sidebar__list">
                {loading ? (
                    <div className="sidebar__loading">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="sidebar__empty">Nenhum contato encontrado</div>
                ) : (
                    filtered.map(contact => (
                        <button
                            key={contact.id}
                            className={`sidebar__item ${selectedContactId === contact.id ? 'sidebar__item--active' : ''}`}
                            onClick={() => onSelectContact(contact)}
                        >
                            <div className="sidebar__avatar">
                                {(contact.pushName || contact.id).charAt(0).toUpperCase()}
                            </div>
                            <div className="sidebar__info">
                                <span className="sidebar__name">{contact.pushName || contact.id.split('@')[0]}</span>
                                <span className="sidebar__preview">Clique para ver mensagens</span>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
