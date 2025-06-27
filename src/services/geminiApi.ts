class GeminiApiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async generateResponse(message: string, tutorSubject: string, sessionHistory: string[] = []): Promise<string> {
    const systemPrompt = `You are an AI tutor specializing in ${tutorSubject}. You can help students with:
1. Creating quizzes on previous topics
2. Providing summaries of previous sessions
3. Clarifying concepts in ${tutorSubject}
4. Answering questions about ${tutorSubject}

Previous session context: ${sessionHistory.join('. ')}

Respond helpfully and educationally.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nStudent message: ${message}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I encountered an issue. Please try again.';
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I encountered an issue connecting to the AI service. Please try again.';
    }
  }

  getInitialGreeting(tutorName: string, subject: string): string {
    return `Hello! I'm your AI tutor assistant for ${subject}, powered by ${tutorName}'s teaching style.

I can help you with:
• 📝 Create quizzes on topics we've discussed
• 📋 Provide summaries of your previous sessions  
• 💡 Clarify any concepts in ${subject}
• ❓ Answer your questions about ${subject}

What would you like to explore today?`;
  }

  getQuickOptions(): Array<{label: string, message: string}> {
    return [
      { label: "Create a Quiz", message: "Can you create a quiz based on our previous discussions?" },
      { label: "Session Summary", message: "Can you provide a summary of my recent learning sessions?" },
      { label: "Clarify Concepts", message: "I need clarification on some concepts we covered." },
      { label: "Ask a Question", message: "I have a specific question about the subject." }
    ];
  }
}

export const geminiApi = new GeminiApiService();