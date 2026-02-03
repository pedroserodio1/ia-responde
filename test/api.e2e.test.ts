import { describe, it, expect, vi, beforeAll } from "vitest";
import { app } from "../src/api/server";

// Mock do Prisma
vi.mock("../src/database/prisma", () => {
  return {
    prisma: {
        contact: {
            findMany: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
        },
        message: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
        summary: {
            findUnique: vi.fn(),
             upsert: vi.fn(),
        },
        $connect: vi.fn(),
        $disconnect: vi.fn(),
    }
  };
});

// Import depois do mock para garantir que ele pegue o mock
import { prisma } from "../src/database/prisma";

describe("API E2E Tests (Mocked DB)", () => {
    
  it("GET /contacts should return 200 and list of contacts", async () => {
    // Mock return value
    const mockContacts = [
        { id: "123@s.whatsapp.net", pushName: "Test User 1", updatedAt: new Date() },
        { id: "456@s.whatsapp.net", pushName: "Test User 2", updatedAt: new Date() }
    ];
    (prisma.contact.findMany as any).mockResolvedValue(mockContacts);

    const response = await app.inject({
      method: "GET",
      url: "/contacts",
    });

    expect(response.statusCode).toBe(200);
    const contacts = JSON.parse(response.payload);
    expect(contacts).toHaveLength(2);
    expect(contacts[0].pushName).toBe("Test User 1");
  });

  it("PUT /contacts/:id should update pushName", async () => {
    const mockContact = { id: "123@s.whatsapp.net", pushName: "Updated Name" };
    (prisma.contact.update as any).mockResolvedValue(mockContact);

    const response = await app.inject({
      method: "PUT",
      url: "/contacts/123@s.whatsapp.net",
      payload: { pushName: "Updated Name" },
    });

    expect(response.statusCode).toBe(200);
    const contact = JSON.parse(response.payload);
    expect(contact.pushName).toBe("Updated Name");
  });

  it("GET /contacts/:id/messages should return messages", async () => {
    const mockMessages = [
        { id: "msg1", text: "Hello", fromMe: false, timestamp: new Date().toISOString() },
        { id: "msg2", text: "Hi", fromMe: true, timestamp: new Date().toISOString() }
    ];
    (prisma.message.findMany as any).mockResolvedValue(mockMessages);

    const response = await app.inject({
      method: "GET",
      url: "/contacts/123@s.whatsapp.net/messages",
    });

    expect(response.statusCode).toBe(200);
    const messages = JSON.parse(response.payload);
    expect(messages).toHaveLength(2);
  });

  it("GET /contacts/:id/summary should return 404 if no summary exists", async () => {
     (prisma.summary.findUnique as any).mockResolvedValue(null);

    const response = await app.inject({
      method: "GET",
      url: "/contacts/123@s.whatsapp.net/summary",
    });

    expect(response.statusCode).toBe(404);
  });

    it("GET /contacts/:id/summary should return 200 if summary exists", async () => {
     const mockSummary = { contactId: "123@s.whatsapp.net", content: "A summary" };
     (prisma.summary.findUnique as any).mockResolvedValue(mockSummary);

    const response = await app.inject({
      method: "GET",
      url: "/contacts/123@s.whatsapp.net/summary",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).content).toBe("A summary");
  });
});

