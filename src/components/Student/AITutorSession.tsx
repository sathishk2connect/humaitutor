import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneCall,
  AlertTriangle,
  RotateCcw,
  PenTool,
  Video,
  ArrowLeft
} from 'lucide-react';
import { TavusConversation } from './TavusConversation';
import { geminiApi } from '../../services/geminiApi';
import { chatService } from '../../services/chatService';

interface AITutorSessionProps {
  sessionId: string;
  onEndSession: () => void;
  tutorInfo?: {
    id: string;
    name: string;
    subject: string;
  };
}

export function AITutorSession({ sessionId, onEndSession, tutorInfo }: AITutorSessionProps) {
  const [showVideoConversation, setShowVideoConversation] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const welcomeMessageSentRef = useRef(false);

  const startVideoChat = () => {
    setShowVideoConversation(true);
  };

  const formatAIResponse = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Replace **text** with bold and * with bullets
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **text** to bold
        .replace(/^\* /gm, '• '); // * to bullet at start of line
      
      return (
        <span key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  useEffect(() => {
    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(sessionId, (newMessages) => {
      setMessages(newMessages);
    });

    // Add welcome message only once per session
    if (!welcomeMessageSentRef.current) {
      welcomeMessageSentRef.current = true;
      
      // Check if session already has messages to avoid duplicates
      const existingMessages = messages.filter(msg => msg.sender === 'ai' && msg.content.includes('Hi! I\'m'));
      
      if (existingMessages.length === 0) {
        const tutorName = tutorInfo?.name || 'AI Tutor';
        const subject = tutorInfo?.subject || 'various subjects';
        
      /*  chatService.sendMessage(sessionId, {
          sender: 'ai',
          content: `Hi! I'm ${tutorName}'s AI assistant. I'm here to help you with ${subject}. What would you like to learn today?`,
          senderName: 'AI Tutor'
        }); */
      }
    }

    return () => unsubscribe();
  }, [sessionId, tutorInfo]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await chatService.sendMessage(sessionId, {
      sender: 'student',
      content: message,
      senderName: 'Student'
    });

    setMessage('');
    setIsLoading(true);

    try {
      const aiResponseText = await geminiApi.generateResponse(
        message, 
        tutorInfo?.subject || 'General', 
        []
      );
      
      await chatService.sendMessage(sessionId, {
        sender: 'ai',
        content: aiResponseText,
        senderName: 'AI Tutor'
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };



  if (showVideoConversation && tutorInfo) {
    return (
      <TavusConversation
        tutorId={tutorInfo.id}
        tutorName={tutorInfo.name}
        subject={tutorInfo.subject}
        onEndSession={() => setShowVideoConversation(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onEndSession}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {tutorInfo ? `${tutorInfo.name} (AI Assistant)` : 'AI Tutor'}
            </h2>
            <p className="text-sm text-gray-600">{tutorInfo?.subject || 'General'} • Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={startVideoChat}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'student'
                  ? 'bg-blue-600 text-white'
                  : msg.sender === 'system'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}
            >
              <div className="text-sm">
                {msg.sender === 'ai' ? formatAIResponse(msg.content) : msg.content}
              </div>
              <p className={`text-xs mt-1 ${
                msg.sender === 'student' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-100 text-purple-800 border border-purple-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your AI tutor anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={sendMessage}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}