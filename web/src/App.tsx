import { useState } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { SummaryPanel } from './components/SummaryPanel';
import { ContactEditModal } from './components/ContactEditModal';
import type { Contact } from './services/api';
import './index.css';

function App() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleContactUpdated = (updated: Contact) => {
    setSelectedContact(updated);
  };

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            onSelectContact={setSelectedContact}
            selectedContactId={selectedContact?.id}
          />
        }
        main={
          <ChatWindow
            contact={selectedContact}
            onEditContact={() => setShowEditModal(true)}
          />
        }
        panel={<SummaryPanel contact={selectedContact} />}
      />

      {showEditModal && selectedContact && (
        <ContactEditModal
          contact={selectedContact}
          onClose={() => setShowEditModal(false)}
          onSave={handleContactUpdated}
        />
      )}
    </>
  );
}

export default App;
