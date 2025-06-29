// Simple Chat Service using Supabase
import { supabase } from '../lib/supabase';

export class ChatService {
  private messageStore: { [sessionId: string]: any[] } = {};

  async sendMessage(sessionId: string, message: { sender: string; content: string; senderName: string }) {
    try {
      const newMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...message,
        createdAt: new Date(),
        timestamp: new Date().toISOString()
      };

      // Store in local memory
      if (!this.messageStore[sessionId]) {
        this.messageStore[sessionId] = [];
      }
      this.messageStore[sessionId].push(newMessage);

      // Store in Supabase session_messages table
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        sender_type: message.sender,
        content: message.content,
        message_type: 'text'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  subscribeToMessages(sessionId: string, callback: (messages: any[]) => void) {
    // Initialize with empty array if not exists
    if (!this.messageStore[sessionId]) {
      this.messageStore[sessionId] = [];
    }

    // Return current messages immediately
    callback(this.messageStore[sessionId]);

    // Simulate real-time updates with polling
    const interval = setInterval(() => {
      callback(this.messageStore[sessionId] || []);
    }, 1000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  }
}

export const chatService = new ChatService();