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
  Video
} from 'lucide-react';
import { TavusConversation } from './TavusConversation';
import { geminiApi } from '../../services/geminiApi';

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
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidence, setConfidence] = useState(85);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorContext, setTutorContext] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [quickOptions] = useState(geminiApi.getQuickOptions());

  useEffect(() => {
    const initialMessage = {
      id: '1',
      type: 'ai' as const,
      content: tutorInfo ? geminiApi.getInitialGreeting(tutorInfo.name, tutorInfo.subject) : "Hi! I'm your AI tutor. I'm here to help you learn. What would you like to explore today?",
      timestamp: new Date(),
      confidence: 95
    };
    setMessages([initialMessage]);
  }, [tutorInfo]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const sessionHistory = messages.filter(m => m.type === 'ai').map(m => m.content);
      const aiResponseText = await geminiApi.generateResponse(
        textToSend, 
        tutorInfo?.subject || 'General', 
        sessionHistory
      );
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponseText,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setConfidence(aiResponse.confidence);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const requestHumanTutor = () => {
    const confirmMessage = {
      id: Date.now().toString(),
      type: 'system' as const,
      content: "I've notified human tutors about your request. Dr. Sarah Johnson will join this session in approximately 3-5 minutes.",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Tutor Session</h2>
              <p className="text-sm text-gray-600">Mathematics • Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Confidence: {confidence}%</span>
            </div>
            
            <button
              onClick={() => setShowVideoConversation(true)}
              className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Start Video Chat</span>
            </button>
            
            {confidence < 70 && (
              <button
                onClick={requestHumanTutor}
                className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span className="text-sm font-medium">Request Human Tutor</span>
              </button>
            )}
            
            <button
              onClick={onEndSession}
              className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">End Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.type === 'system'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                    {msg.type === 'ai' && msg.confidence && (
                      <span className="text-xs opacity-70">
                        {msg.confidence}% confident
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Options */}
          {messages.length === 1 && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-3">Quick options:</p>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(option.message)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={() => sendMessage()}
                disabled={isLoading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsSpeaking(!isSpeaking)}
                className={`p-3 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Whiteboard Section */}
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Whiteboard</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearCanvas}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-6 h-6 bg-blue-600 rounded border-2 border-gray-300"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <canvas
              ref={canvasRef}
              width={320}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full border border-gray-200 rounded-lg cursor-crosshair"
            />
          </div>
        </div>
      </div>
    </div>
  );
}