import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api, type Contact } from '../services/api';
import './ContactEditModal.css';

interface ContactEditModalProps {
    contact: Contact;
    onClose: () => void;
    onSave: (updated: Contact) => void;
}

export function ContactEditModal({ contact, onClose, onSave }: ContactEditModalProps) {
    const [pushName, setPushName] = useState(contact.pushName || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put<Contact>(`/contacts/${contact.id}`, { pushName });
            onSave(res.data);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal glass-panel" onClick={e => e.stopPropagation()}>
                <header className="modal__header">
                    <h2>Editar Contato</h2>
                    <button className="modal__close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="modal__body">
                    <div className="form-group">
                        <label htmlFor="contactId">ID do Contato</label>
                        <input
                            id="contactId"
                            type="text"
                            value={contact.id}
                            disabled
                            className="form-input form-input--disabled"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pushName">Nome</label>
                        <input
                            id="pushName"
                            type="text"
                            value={pushName}
                            onChange={e => setPushName(e.target.value)}
                            placeholder="Nome do contato"
                            className="form-input"
                        />
                    </div>
                </div>

                <footer className="modal__footer">
                    <button className="btn btn--secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                        <Save size={16} />
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </footer>
            </div>
        </div>
    );
}
