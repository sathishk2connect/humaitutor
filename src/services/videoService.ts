// Agora Video Service
export class VideoService {
  async updateSessionStatus(sessionId: string, status: 'waiting' | 'active' | 'ended') {
    // Update session status in Supabase
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase
        .from('sessions')
        .update({ 
          status: status === 'waiting' ? 'scheduled' : status === 'active' ? 'active' : 'completed',
          video_call_status: status
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  }
}

export const videoService = new VideoService();