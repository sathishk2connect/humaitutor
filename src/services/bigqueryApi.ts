interface TutorContext {
  tutor_id: string;
  tutor_name: string;
  subject: string;
  context: string;
  created_at: string;
  updated_at: string;
}

class BigQueryApiService {
  private baseUrl = '/api/bigquery';

  async saveTutorContext(tutorId: string, tutorName: string, subject: string, context: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/tutor-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutor_id: tutorId,
          tutor_name: tutorName,
          subject: subject,
          context: context,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error saving tutor context:', error);
    }
  }

  async getTutorContext(tutorId: string): Promise<TutorContext | null> {
    try {
      const response = await fetch(`${this.baseUrl}/tutor-context/${tutorId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error retrieving tutor context:', error);
      return null;
    }
  }
}

export const bigqueryApi = new BigQueryApiService();
export type { TutorContext };