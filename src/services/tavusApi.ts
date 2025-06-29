// Tavus.io API Integration Service
// This service handles communication with Tavus.io API for creating conversational AI replicas

interface TavusReplicaRequest {
  video: File;
  replica_name: string;
  callback_url?: string;
  training_data?: string;
}

interface TavusReplicaResponse {
  replica_id: string;
  status: 'processing' | 'ready' | 'error';
  created_at: string;
  video_url?: string;
  conversation_url?: string;
}

interface TavusConversationRequest {
  replica_id: string;
  conversation_name?: string;
  persona_id?: string;
  conversational_context?: string;
  callback_url?: string | null;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
  };
}

class TavusApiService {
  private baseUrl = 'https://tavusapi.com/v2';
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_TAVUS_API_KEY || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Tavus API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Create a new AI replica from uploaded video
  async createReplica(request: TavusReplicaRequest): Promise<TavusReplicaResponse> {
    const formData = new FormData();
    formData.append('video', request.video);
    formData.append('replica_name', request.replica_name);
    
    if (request.callback_url) {
      formData.append('callback_url', request.callback_url);
    }
    
    if (request.training_data) {
      formData.append('training_data', request.training_data);
    }

    const response = await fetch(`${this.baseUrl}/replicas`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create replica: ${response.status}`);
    }

    return response.json();
  }

  // Get replica status and details
  async getReplicaStatus(replicaId: string): Promise<TavusReplicaResponse> {
    return this.makeRequest(`/replicas/${replicaId}`);
  }

  // List all replicas for the account
  async listReplicas(): Promise<TavusReplicaResponse[]> {
    const response = await this.makeRequest('/replicas');
    return response.replicas || [];
  }

  // Create a conversation session with a replica
  async createConversation(request: any): Promise<{ conversation_id: string; conversation_url: string }> {
    return this.makeRequest('/conversations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }



  // Delete a replica
  async deleteReplica(replicaId: string): Promise<void> {
    await this.makeRequest(`/replicas/${replicaId}`, {
      method: 'DELETE',
    });
  }

  // Get conversation history
  async getConversationHistory(conversationId: string): Promise<any> {
    return this.makeRequest(`/conversations/${conversationId}/history`);
  }

  // Update replica settings
  async updateReplica(replicaId: string, updates: Partial<TavusReplicaRequest>): Promise<TavusReplicaResponse> {
    return this.makeRequest(`/replicas/${replicaId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

// Export singleton instance
export const tavusApi = new TavusApiService();

// Export types for use in components
export type { TavusReplicaRequest, TavusReplicaResponse, TavusConversationRequest };