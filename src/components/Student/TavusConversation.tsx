import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { tavusApi } from '../../services/tavusApi';

interface TavusConversationProps {
  tutorId: string;
  tutorName: string;
  subject: string;
  onEndSession: () => void;
}

export function TavusConversation({ tutorId, tutorName, subject, onEndSession }: TavusConversationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conversationUrl, setConversationUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      
      // Generate random conversation name and context
      const conversationName = `${subject}_session_${Date.now()}`;
      const context = `You are ${tutorName}, an expert ${subject} tutor. Help the student with their questions in a friendly and educational manner. Provide clear explanations and examples.`;
      
      // Get the tutor's replica ID (in real app, this would be stored with tutor data)
      const replicaId = `rb17cf590e15`; // Using example replica ID
      
      // Create conversation with Tavus
      const conversation = await tavusApi.createConversation({
        replica_id: replicaId
      });
      
      setConversationUrl(conversation.conversation_url);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to start AI conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-white text-lg font-medium mb-2">Starting AI Conversation</h3>
          <p className="text-gray-400">Connecting with {tutorName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-white text-lg font-medium mb-2">Connection Failed</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={onEndSession}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onEndSession}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-semibold">AI Tutor Session</h2>
              <p className="text-gray-400 text-sm">{tutorName} • {subject}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {conversationUrl ? (
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={conversationUrl}
                className="w-full h-96 md:h-[500px] lg:h-[600px]"
                allow="camera; microphone; autoplay"
                allowFullScreen
                title={`AI Conversation with ${tutorName}`}
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full px-6 py-3">
                  <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full transition-colors ${
                      isMuted 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-5 h-5 text-white" />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition-colors ${
                      !isVideoOn 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isVideoOn ? (
                      <Video className="w-5 h-5 text-white" />
                    ) : (
                      <VideoOff className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={onEndSession}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">Preparing Video Session</h3>
              <p className="text-gray-400">Setting up your conversation with {tutorName}...</p>
            </div>
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Session Duration: 00:00</span>
              <span>•</span>
              <span>Quality: HD</span>
            </div>
            <div className="text-gray-400">
              Powered by Tavus.io
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}