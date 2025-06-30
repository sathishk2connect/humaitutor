

import { tokenService } from './tokenService';

export class AgoraService {
  generateChannelName(sessionId: string): string {
    return `session_${sessionId}`;
  }

  async generateToken(channelName: string, uid: number, role: 'publisher' | 'subscriber' = 'publisher'): Promise<string> {
    console.log(`Generating token for channel: ${channelName}, uid: ${uid}, role: ${role}`);
    return await tokenService.generateAgoraToken(channelName, uid, role);
  }

  generateUid(userType: 'student' | 'tutor'): number {
    const baseUid = userType === 'student' ? 1000 : 2000;
    return baseUid + Math.floor(Math.random() * 1000);
  }
}

export const agoraService = new AgoraService();