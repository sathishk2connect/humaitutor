import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

interface VideoCallProps {
  sessionId: string;
  userType: 'student' | 'tutor';
  userName: string;
  onEndCall: () => void;
}

export function VideoCall({ sessionId, userType, userName, onEndCall }: VideoCallProps) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);

  const initializeCall = async () => {
    try {
      const appId = import.meta.env.VITE_AGORA_APP_ID;
      if (!appId) {
        console.error('Agora App ID not found');
        return;
      }

      // Create Agora client
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      // Generate UID based on user type
      const uid = userType === 'student' ? 1000 + Math.floor(Math.random() * 1000) : 2000 + Math.floor(Math.random() * 1000);
      
      const token = import.meta.env.VITE_AGORA_TEMP_TOKEN;
      // Join channel
      await clientRef.current.join(appId, "HumaiTokenChannel", token, uid);
      
      // Create local tracks
      localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      
      // Play local video
      if (localVideoRef.current && localVideoTrackRef.current) {
        localVideoTrackRef.current.play(localVideoRef.current);
      }
      
      // Publish local tracks
      await clientRef.current.publish([localVideoTrackRef.current, localAudioTrackRef.current]);
      
      // Listen for remote users
      clientRef.current.on('user-joined', async (user) => {
        console.log('Remote user joined:', user.uid);
      });
      
      clientRef.current.on('user-published', async (user, mediaType) => {
        await clientRef.current!.subscribe(user, mediaType);
        
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
          setRemoteUserJoined(true);
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });
      
      clientRef.current.on('user-left', (user) => {
        console.log('Remote user left:', user.uid);
        setRemoteUserJoined(false);
      });
      
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to initialize call:', error);
    }
  };

  const toggleMute = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    try {
      // Clean up local tracks
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      
      // Leave channel
      if (clientRef.current) {
        await clientRef.current.leave();
      }
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      onEndCall();
    }
  };

  useEffect(() => {
    initializeCall();
    
    return () => {
      // Cleanup on unmount
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div 
          ref={remoteVideoRef}
          className="w-full h-full bg-gray-900 relative"
        >
          {!remoteUserJoined && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-10 h-10" />
                </div>
                <p className="text-lg">
                  {userType === 'student' 
                    ? 'Waiting for tutor to join...' 
                    : 'Connecting to student...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div 
          ref={localVideoRef}
          className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white"
        />
      </div> 

      {/* Controls */}
      <div className="bg-gray-900 p-6 flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted ? 'bg-red-600' : 'bg-gray-700'
          } text-white hover:bg-opacity-80 transition-colors`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoOff ? 'bg-red-600' : 'bg-gray-700'
          } text-white hover:bg-opacity-80 transition-colors`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}