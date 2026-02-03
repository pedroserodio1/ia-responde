import { useState, useEffect } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { api, type Contact, type Summary } from '../services/api';
import './SummaryPanel.css';

interface SummaryPanelProps {
    contact: Contact | null;
}

export function SummaryPanel({ contact }: SummaryPanelProps) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchSummary = () => {
        if (!contact) return;
        setLoading(true);
        setError(false);
        api.get<Summary>(`/contacts/${contact.id}/summary`)
            .then(res => setSummary(res.data))
            .catch(() => {
                setSummary(null);
                setError(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSummary();
    }, [contact]);

    if (!contact) {
        return (
            <div className="summary-panel">
                <div className="summary-panel__empty">
                    <Brain size={32} />
                    <p>Resumo da IA</p>
                </div>
            </div>
        );
    }

    return (
        <div className="summary-panel">
            <header className="summary-panel__header">
                <div className="summary-panel__title">
                    <Brain size={20} />
                    <span>Resumo da IA</span>
                </div>
                <button className="summary-panel__refresh" onClick={fetchSummary} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
            </header>

            <div className="summary-panel__content">
                {loading ? (
                    <div className="summary-panel__loading">
                        <div className="summary-panel__spinner"></div>
                        <span>Gerando resumo...</span>
                    </div>
                ) : error ? (
                    <div className="summary-panel__error">
                        <p>Nenhum resumo disponível para este contato.</p>
                    </div>
                ) : summary ? (
                    <div className="summary-panel__text">
                        <p>{summary.content}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
