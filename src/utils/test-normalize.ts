import normalizeMessage from './normalize-message';
import { WAMessage } from 'baileys';

// Helper to create mock messages
const createMockMsg = (overrides: any = {}): WAMessage => ({
    key: {
        remoteJid: '123456789@s.whatsapp.net',
        fromMe: false,
        id: 'ABCDEF',
        ...overrides.key
    },
    message: {
        conversation: 'Hello',
        ...overrides.message
    },
    messageTimestamp: 1672531200,
    pushName: 'TestUser',
    ...overrides
} as WAMessage);

const runTests = () => {
    console.log('--- Testing normalizeMessage ---');

    // Test 1: Incoming DM (fromMe=false)
    const dmIncoming = normalizeMessage(createMockMsg({
        key: { remoteJid: '551199999999@s.whatsapp.net', fromMe: false }
    }));
    console.log('Test 1 (Incoming DM):', 
        dmIncoming?.from === '551199999999@s.whatsapp.net' ? 'PASS' : 'FAIL', 
        `Expected 551199999999@s.whatsapp.net, got ${dmIncoming?.from}`
    );
    console.log('   pushName check:', dmIncoming?.pushName === 'TestUser' ? 'PASS' : 'FAIL');

    // Test 2: Outgoing DM (fromMe=true)
    const dmOutgoing = normalizeMessage(createMockMsg({
        key: { remoteJid: '551199999999@s.whatsapp.net', fromMe: true },
        pushName: 'MyBot'
    }));
    // Expect from (contactId) to be remoteJid (the recipient)
    console.log('Test 2 (Outgoing DM):', 
        dmOutgoing?.from === '551199999999@s.whatsapp.net' ? 'PASS' : 'FAIL',
        `Expected 551199999999@s.whatsapp.net, got ${dmOutgoing?.from}`
    );
    // pushName should be null to avoid overwriting contact with bot name
    console.log('   pushName null check:', dmOutgoing?.pushName === null ? 'PASS' : 'FAIL');

    // Test 3: Incoming Group Message (fromMe=false)
    const groupIncoming = normalizeMessage(createMockMsg({
        key: { 
            remoteJid: '123456@g.us', 
            fromMe: false,
            participant: '551188888888@s.whatsapp.net' 
        }
    }));
    // Expect from (contactId) to be participant (the sender)
    console.log('Test 3 (Incoming Group):', 
        groupIncoming?.from === '551188888888@s.whatsapp.net' ? 'PASS' : 'FAIL',
        `Expected 551188888888@s.whatsapp.net, got ${groupIncoming?.from}`
    );

    // Test 4: Outgoing Group Message (fromMe=true)
    const groupOutgoing = normalizeMessage(createMockMsg({
        key: { 
            remoteJid: '123456@g.us', 
            fromMe: true,
            participant: undefined // usually undefined for self in some versions, or even if present 
        }
    }));
    // Expect from (contactId) to be remoteJid (the group) ?? or should it be ignored? 
    // Wait, requirement says: "Se msg.key.fromMe === true, o contactId deve ser msg.key.remoteJid."
    // So for outgoing group message, we identify the 'contact' as the Group JID.
    console.log('Test 4 (Outgoing Group):', 
        groupOutgoing?.from === '123456@g.us' ? 'PASS' : 'FAIL',
        `Expected 123456@g.us, got ${groupOutgoing?.from}`
    );

    // Test 5: Status Broadcast (should be isEvent=true or null?)
    const statusMsg = normalizeMessage(createMockMsg({
        key: { remoteJid: 'status@broadcast' }
    }));
    console.log('Test 5 (Status Broadcast):', statusMsg?.isEvent === true || statusMsg === null ? 'PASS' : 'FAIL', statusMsg);

    // Test 6: Protocol Message (no content)
    const protoMsg = normalizeMessage({
        key: { remoteJid: '123@s.whatsapp.net' },
        messageStubType: 1, // e.g. revoke
        message: undefined
    } as any);
    console.log('Test 6 (Protocol Msg):', protoMsg?.isEvent === true ? 'PASS' : 'FAIL', protoMsg);

}

runTests();
