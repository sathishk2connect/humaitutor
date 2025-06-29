import React, { useState, useEffect } from 'react';
import { Bot, User, Calendar, Clock, Star, MessageSquare, Video } from 'lucide-react';
import { AITutorSession } from './AITutorSession';
import { HumanTutorSession } from './HumanTutorSession';
import { TavusConversation } from './TavusConversation';
import { ScheduleSessionModal } from './ScheduleSessionModal';
import { supabaseService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';

export function LearnTab() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'ai' | 'human' | 'tavus'>('ai');
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [enrolledTutors, setEnrolledTutors] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTutorForSchedule, setSelectedTutorForSchedule] = useState<any>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<'human' | 'ai'>('human');
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load tutors
      const tutors = await supabaseService.getTutors();
      const formattedTutors = tutors.map(tutor => ({
        id: tutor.id,
        name: tutor.users?.name || 'Unknown Tutor',
        subject: tutor.tutor_subjects?.[0]?.subjects?.name || 'General',
        avatar: tutor.users?.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        rating: tutor.rating,
        isOnline: tutor.is_available,
        nextSession: '2024-01-20 14:00',
        totalSessions: tutor.total_sessions,
        hourlyRate: tutor.hourly_rate
      }));
      setEnrolledTutors(formattedTutors.slice(0, 3)); // Show first 3 as "enrolled"

      // Load upcoming sessions
      if (user) {
        const sessions = await supabaseService.getSessions(user.id, user.role);
        const now = new Date();
        // Check for active sessions
        const activeSessionExists = sessions.some(session => {
          const startTime = new Date(session.start_time || session.scheduled_at || session.created_at);
          const endTime = new Date(startTime.getTime() + (session.duration_minutes || 60) * 60 * 1000);
          return now >= startTime && now <= endTime && ['scheduled', 'pending', 'active'].includes(session.status);
        });
        setHasActiveSession(activeSessionExists);

        const upcoming = sessions
          .filter(session => {
            const isValidStatus = ['scheduled', 'pending', 'active'].includes(session.status);
            const endTime = session.end_time ? new Date(session.end_time) : null;
            const isNotCompleted = !endTime || endTime > now;
            return isValidStatus && isNotCompleted;
          })
          .slice(0, 3)
          .map(session => {
            const scheduledDate = new Date(session.scheduled_at || session.created_at);
            const now = new Date();
            const hoursUntilSession = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            const sessionEndTime = new Date(scheduledDate.getTime() + (session.duration_minutes || 60) * 60 * 1000);
            const isWithinSessionTime = now >= scheduledDate && now <= sessionEndTime;
            const canJoinBeforeStart = Math.abs(hoursUntilSession * 60) <= 5; // Within 5 minutes of start
            
            return {
              id: session.id,
              tutor: session.tutors?.users?.name || 'AI Assistant',
              subject: session.subjects?.name || 'General',
              date: scheduledDate.toISOString().split('T')[0],
              time: scheduledDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              type: session.title || `${session.type} Session`,
              duration: `${session.duration_minutes || 60} min`,
              status: session.status,
              sessionType: session.type,
              canReschedule: hoursUntilSession > 6 && session.status !== 'active',
              canJoin: canJoinBeforeStart || isWithinSessionTime,
              amount: session.amount || 0,
              tutorInfo: {
                id: session.tutor_id || session.id,
                name: session.type === 'ai' && !session.tutor_id 
                  ? 'Dr. Sarah Chen'
                  : session.tutors?.users?.name || 'AI Assistant',
                subject: session.subjects?.name || 'General',
                avatar: session.tutors?.users?.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
              }
            };
          });
        setUpcomingSessions(upcoming);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (activeSession && sessionType === 'tavus' && selectedTutor) {
    return (
      <TavusConversation
        tutorId={selectedTutor.id}
        tutorName={selectedTutor.name}
        subject={selectedTutor.subject}
        onEndSession={() => {
          setActiveSession(null);
          setSelectedTutor(null);
        }}
      />
    );
  }

  if (activeSession && sessionType === 'human' && selectedTutor) {
    return (
      <HumanTutorSession
        sessionId={activeSession}
        tutorInfo={selectedTutor}
        onEndSession={() => {
          setActiveSession(null);
          setSelectedTutor(null);
        }}
      />
    );
  }

  if (activeSession && sessionType === 'ai') {
    return (
      <AITutorSession 
        sessionId={activeSession}
        onEndSession={() => setActiveSession(null)}
        tutorInfo={selectedTutor}
      />
    );
  }

  if (activeSession) {
    return (
      <AITutorSession 
        sessionId={activeSession}
        onEndSession={() => setActiveSession(null)}
      />
    );
  }
  
  const scheduleSession = (tutorId: string, type: 'human' | 'ai') => {
    if (hasActiveSession) {
      setOverlayMessage('You have an active session running. Please wait for it to complete before scheduling another session.');
      setTimeout(() => setOverlayMessage(null), 4000);
      return;
    }
    
    const tutor = enrolledTutors.find(t => t.id === tutorId);
    if (tutor) {
      setSelectedTutorForSchedule(tutor);
      setSelectedSessionType(type);
      setShowScheduleModal(true);
      // Set the selected tutor for AI sessions to ensure proper display
      if (type === 'ai') {
        setSelectedTutor(tutor);
      }
    }
  };

  const handleScheduleComplete = (sessionData: any) => {
    setShowScheduleModal(false);
    setSelectedTutorForSchedule(null);
    loadData();
  };

  const joinSession = (session: any) => {
    if (session.sessionType === 'ai') {
      setSessionType('ai');
      setSelectedTutor(session.tutorInfo);
      setActiveSession(session.id);
    } else {
      setSessionType('human');
      setSelectedTutor(session.tutorInfo);
      setActiveSession(session.id);
    }
  };

  const sendMessage = (tutorId: string) => {
    alert(`Sending message to tutor ${tutorId}`);
  };

  const startSession = async (type: 'ai' | 'human' | 'tavus', tutor?: any) => {
    try {
      if (user && tutor) {
        // Get student data
        const student = await supabaseService.getStudentByUserId(user.id);
        
        // Get subject data
        const subjects = await supabaseService.getSubjects();
        const mathSubject = subjects.find(s => s.name === 'Mathematics');
        
        // Create session in database
        const sessionData = {
          student_id: student.id,
          tutor_id: type === 'human' ? tutor.id : undefined,
          subject_id: mathSubject?.id || subjects[0]?.id,
          type: type === 'tavus' ? 'ai' as const : type,
          title: `${type === 'ai' ? 'AI' : 'Human'} Tutoring Session`,
          scheduled_at: new Date().toISOString(),
          duration_minutes: 60
        };
        
        const session = await supabaseService.createSession(sessionData);
        
        setSessionType(type);
        if (tutor) {
          setSelectedTutor(tutor);
        }
        setActiveSession(session.id);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // Fallback to demo mode
      setSessionType(type);
      if (tutor) {
        setSelectedTutor(tutor);
      }
      // Generate a proper UUID for demo session
      const demoSessionId = crypto.randomUUID();
      setActiveSession(demoSessionId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-600">Loading your tutors and sessions...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-48 rounded-xl"></div>
          <div className="bg-gray-200 h-48 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Overlay Message */}
      {overlayMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <p className="text-sm font-medium">{overlayMessage}</p>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">Connect with your enrolled tutors and AI assistants</p>
      </div>

      {/* Enrolled Tutors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Tutors</h3>
        <div className="space-y-4">
          {enrolledTutors.map((tutor) => (
            <div key={tutor.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2';
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      tutor.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tutor.name}</h4>
                    <p className="text-sm text-gray-600">{tutor.subject}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{tutor.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{tutor.totalSessions} sessions</span>
                      <span className="text-xs text-gray-500">${tutor.hourlyRate}/hr</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tutor.isOnline 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tutor.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                    onClick={() => sendMessage(tutor.id)}
                    className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Message</span>
                  </button>
                  <button
                    onClick={() => scheduleSession(tutor.id, 'human')}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-medium">Human Session</span>
                  </button>
                                  <button
                    onClick={() => scheduleSession(tutor.id, 'ai')}
                    className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Session</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.sessionType === 'ai' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {session.sessionType === 'ai' ? (
                      <Bot className={`w-5 h-5 ${
                        session.sessionType === 'ai' ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{session.type}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {session.status === 'pending' ? 'Pending Approval' : 'Confirmed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{session.tutor} • {session.subject}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{session.date} at {session.time}</span>
                      </div>
                      <span className="text-xs text-gray-500">Duration: {session.duration}</span>
                      <span className="text-xs text-gray-500">Cost: ${session.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    disabled={!session.canReschedule}
                    className={`text-sm px-3 py-1 border rounded-lg transition-colors ${
                      session.canReschedule
                        ? 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
                        : 'text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => joinSession(session)}
                    disabled={!session.canJoin}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                      session.canJoin
                        ? session.status === 'active' 
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {session.canJoin 
                      ? session.status === 'active' ? 'Rejoin' : 'Join'
                      : 'Not Ready'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Sessions</h4>
            <p className="text-gray-600 mb-4">Schedule a session with one of your tutors to get started.</p>
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && selectedTutorForSchedule && (
        <ScheduleSessionModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedTutorForSchedule(null);
          }}
          tutor={selectedTutorForSchedule}
          sessionType={selectedSessionType}
          onSchedule={handleScheduleComplete}
        />
      )}
    </div>
  );
}