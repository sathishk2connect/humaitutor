// Token service that calls backend API for token generation
export class TokenService {
  async generateAgoraToken(channelName: string, uid: number, role: 'publisher' | 'subscriber' = 'publisher'): Promise<string> {
    try {
      // Call Supabase Edge Function for token generation
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/agora-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          channelName,
          uid,
          role,
          appId: import.meta.env.VITE_AGORA_APP_ID,
          appCertificate: import.meta.env.VITE_AGORA_APP_CERTIFICATE,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error generating token:', error);
      // Fallback to temp token for development
      console.warn('Falling back to temp token');
      return import.meta.env.VITE_AGORA_TEMP_TOKEN;
    }
  }
}

export const tokenService = new TokenService();