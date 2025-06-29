import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Video, Phone } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { videoService } from '../../services/videoService';
import { VideoCall } from '../VideoCall';

interface TutorSessionProps {
  sessionId: string;
  studentInfo: {
    id: string;
    name: string;
    subject: string;
    avatar: string;
  };
  onEndSession: () => void;
}

export function TutorSession({ sessionId, studentInfo, onEndSession }: TutorSessionProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'waiting' | 'active'>('idle');

  const endVideoCall = () => {
    setIsVideoCall(false);
    setCallStatus('idle');
    videoService.updateSessionStatus(sessionId, 'ended');
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    await chatService.sendMessage(sessionId, {
      sender: 'tutor',
      content: message,
      senderName: 'Tutor'
    });

    setMessage('');
  };

  const startVideoCall = async () => {
    try {
      setCallStatus('active');
      await videoService.updateSessionStatus(sessionId, 'active');
      setIsVideoCall(true);
    } catch (error) {
      console.error('Error starting video call:', error);
      setCallStatus('idle');
    }
  };

  useEffect(() => {
    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(sessionId, (newMessages) => {
      setMessages(newMessages);
    });

    // Add welcome message
    chatService.sendMessage(sessionId, {
      sender: 'system',
      content: `Tutor has joined the session with ${studentInfo.name}. You can now chat and start video calls.`,
      senderName: 'System'
    });

    return () => unsubscribe();
  }, [sessionId, studentInfo.name]);

  if (isVideoCall) {
    return (
      <VideoCall
        sessionId={sessionId}
        userType="tutor"
        userName="Tutor"
        onEndCall={endVideoCall}
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
          <img
            src={studentInfo.avatar}
            alt={studentInfo.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{studentInfo.name}</h2>
            <p className="text-sm text-gray-600">{studentInfo.subject} • Student</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={startVideoCall}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'tutor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'tutor'
                  ? 'bg-green-600 text-white'
                  : msg.sender === 'system'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'tutor' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={sendMessage}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}