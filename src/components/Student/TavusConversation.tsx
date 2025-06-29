import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { tavusApi } from '../../services/tavusApi';

// Declare Daily types
declare global {
  interface Window {
    Daily: any;
    _dailyCallObject: any;
  }
}

const getOrCreateCallObject = () => {
  if (!window._dailyCallObject) {
    window._dailyCallObject = window.Daily.createCallObject();
  }
  return window._dailyCallObject;
};

interface TavusConversationProps {
  tutorId: string;
  tutorName: string;
  subject: string;
  onEndSession: () => void;
}

export function TavusConversation({ tutorId, tutorName, subject, onEndSession }: TavusConversationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conversationUrl, setConversationUrl] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string>('');
  const [remoteParticipants, setRemoteParticipants] = useState<any>({});
  const [localParticipant, setLocalParticipant] = useState<any>(null);
  const callRef = useRef<any>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      initializeConversation();
    }
  }, [isInitialized]);

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      
      // Generate conversation context with greeting instructions
      const context = `You are ${tutorName}, an expert ${subject} tutor. You should:
        1. Start with a warm greeting introducing yourself
        2. Ask what the student wants to learn about ${subject}
        3. Provide clear, educational explanations with examples
        4. Be encouraging and patient
        5. Break down complex topics into simple steps

        Always maintain a friendly, professional teaching demeanor.`;
      
      // Get the tutor's replica ID (in real app, this would be stored with tutor data)
      const replicaId = `rb17cf590e15`; // Using example replica ID
      
      // Create conversation with Tavus with initial greeting
      const conversation = await tavusApi.createConversation({
        replica_id: replicaId,
        conversational_context: context,
        properties: {
          max_call_duration: 7200,
          participant_left_timeout: 300,
          participant_absent_timeout: 180,
          enable_recording: false
        }
      });
      
      setConversationUrl(conversation.conversation_url);
      setConversationId(conversation.conversation_id);
      
      // Initialize Daily call and send greeting
      if (conversation.conversation_url && conversation.conversation_id) {
        await initializeDailyCall(conversation.conversation_url, conversation.conversation_id);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to start AI conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = async () => {
    if (callRef.current && callRef.current.meetingState() === 'joined-meeting') {
      await callRef.current.setLocalAudio(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (callRef.current && callRef.current.meetingState() === 'joined-meeting') {
      await callRef.current.setLocalVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const initializeDailyCall = async (url: string, convId: string) => {
    try {
      // Load Daily script if not already loaded
      if (!window.Daily) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@daily-co/daily-js';
        script.onload = () => {
          setupDailyCall(url, convId);
        };
        document.head.appendChild(script);
      } else {
        setupDailyCall(url, convId);
      }
    } catch (error) {
      console.error('Failed to initialize Daily call:', error);
    }
  };

  const setupDailyCall = async (url: string, convId: string) => {
    try {
      // Check if already connected to avoid duplicate calls
      if (window._dailyCallObject && window._dailyCallObject.meetingState() === 'joined-meeting') {
        console.log('Already connected to Daily call');
        return;
      }
      
      // Get or create singleton call object
      callRef.current = getOrCreateCallObject();
      
      // Handle participants
      const updateParticipants = () => {
        const participants = callRef.current.participants();
        const remotes: any = {};
        Object.entries(participants).forEach(([id, p]: [string, any]) => {
          if (id !== 'local') {
            remotes[id] = p;
          } else {
            setLocalParticipant(p);
          }
        });
        setRemoteParticipants(remotes);
      };

      const updateLocal = () => {
        const participants = callRef.current.participants();
        setLocalParticipant(participants.local);
      };

      callRef.current.on('participant-joined', updateParticipants);
      callRef.current.on('participant-updated', updateParticipants);
      callRef.current.on('participant-left', updateParticipants);
      callRef.current.on('local-participant-updated', updateLocal);
      
      // Join the Daily room with audio/video enabled
      await callRef.current.join({ 
        url,
        startVideoOff: !isVideoOn,
        startAudioOff: isMuted,
        userName: 'Student'
      });
      
      // Wait for join to complete and then send greeting
      callRef.current.on('participant-joined', () => {
        setTimeout(() => {
          const greetingMessage = `Hello! I'm ${tutorName} AI Assistant, your ${subject} tutor. I'm excited to help you learn today! What topic would you like to explore, or do you have any specific questions about ${subject}?`;
          
          const interaction = {
            message_type: 'conversation',
            event_type: 'conversation.echo',
            conversation_id: convId,
            properties: {
              modality: 'text',
              text: greetingMessage,
              done: true
            }
          };
          
          // Send the echo interaction after join is complete
          callRef.current.sendAppMessage(interaction, '*');
        }, 1000); // Wait 1 second after join to ensure connection is stable
      });
      
    } catch (error) {
      console.error('Failed to setup Daily call:', error);
    }
  };

  // Attach video and audio tracks
  useEffect(() => {
    // Remote participants
    Object.entries(remoteParticipants).forEach(([id, p]: [string, any]) => {
      const videoEl = document.getElementById(`remote-video-${id}`);
      if (videoEl && p.tracks.video && p.tracks.video.state === 'playable' && p.tracks.video.persistentTrack) {
        videoEl.srcObject = new MediaStream([p.tracks.video.persistentTrack]);
      }
      const audioEl = document.getElementById(`remote-audio-${id}`);
      if (audioEl && p.tracks.audio && p.tracks.audio.state === 'playable' && p.tracks.audio.persistentTrack) {
        audioEl.srcObject = new MediaStream([p.tracks.audio.persistentTrack]);
      }
    });

    // Local participant
    if (localParticipant) {
      const localVideoEl = document.getElementById('local-video');
      if (localVideoEl && localParticipant.tracks.video && localParticipant.tracks.video.state === 'playable' && localParticipant.tracks.video.persistentTrack) {
        localVideoEl.srcObject = new MediaStream([localParticipant.tracks.video.persistentTrack]);
      }
    }
  }, [remoteParticipants, localParticipant]);

  useEffect(() => {
    return () => {
      // Cleanup Daily call on unmount
      if (callRef.current) {
        callRef.current.leave();
      }
    };
  }, []);

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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Remote Video */}
          {Object.keys(remoteParticipants).length > 0 ? (
            Object.entries(remoteParticipants).map(([id, p]: [string, any]) => (
              <div key={id} className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                <video
                  id={`remote-video-${id}`}
                  autoPlay
                  playsInline
                  className="w-full h-96 md:h-[400px] object-cover"
                />
                <audio id={`remote-audio-${id}`} autoPlay playsInline />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
                  {tutorName} (AI Tutor)
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">Connecting to {tutorName}</h3>
              <p className="text-gray-400">Please wait while we establish the connection...</p>
            </div>
          )}
          
          {/* Local Video */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              id="local-video"
              autoPlay
              playsInline
              muted
              className="w-full h-96 md:h-[400px] object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
              You
            </div>
            {isMuted && (
              <div className="absolute top-2 right-2 bg-red-600 p-2 rounded-full">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center space-x-4">
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