import React, { useState, useEffect } from 'react';
import { Video, MessageSquare, Clock, User } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { VideoCall } from '../VideoCall';
import { useAuth } from '../../contexts/AuthContext';

export function ActiveSessions() {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    if (user) {
      loadActiveSessions();
      const interval = setInterval(loadActiveSessions, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadActiveSessions = async () => {
    try {
      if (!user) return;
      
      const sessions = await supabaseService.getSessions(user.id, 'tutor');
      const waiting = sessions.filter(session => 
        session.status === 'scheduled' && 
        session.video_call_status === 'waiting'
      );
      
      setActiveSessions(waiting);
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  const joinVideoCall = (session: any) => {
    setSelectedSession(session);
    setIsVideoCall(true);
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    setSelectedSession(null);
    loadActiveSessions();
  };

  if (isVideoCall && selectedSession) {
    return (
      <VideoCall
        sessionId={selectedSession.id}
        userType="tutor"
        userName="Tutor"
        onEndCall={endVideoCall}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Sessions</h1>
        <p className="text-gray-600">Students waiting for video calls</p>
      </div>

      {activeSessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Sessions</h3>
          <p className="text-gray-600">Students will appear here when they request video calls</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {session.students?.users?.name || 'Student'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {session.subjects?.name || 'General'} • Waiting for video call
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Started {new Date(session.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => joinVideoCall(session)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Call</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}