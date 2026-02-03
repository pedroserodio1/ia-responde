import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Types
export interface Contact {
  id: string;
  pushName: string | null;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
  createdAt: string;
}

export interface Summary {
  content: string;
  updatedAt: string;
}
