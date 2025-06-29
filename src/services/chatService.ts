// Chat Service using Supabase
import { supabase } from '../lib/supabase';

export class ChatService {
  async sendMessage(sessionId: string, message: { sender: string; content: string; senderName: string }) {
    try {
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

  async getMessages(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(msg => ({
        id: msg.id,
        sender: msg.sender_type,
        content: msg.content,
        senderName: msg.sender_type,
        createdAt: msg.created_at
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  subscribeToMessages(sessionId: string, callback: (messages: any[]) => void) {
    // Load initial messages
    this.getMessages(sessionId).then(callback);

    // Poll for new messages every 2 seconds
    const interval = setInterval(async () => {
      const messages = await this.getMessages(sessionId);
      callback(messages);
    }, 2000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  }
}

export const chatService = new ChatService();