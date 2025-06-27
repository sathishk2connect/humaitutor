import React, { useState } from 'react';
import { Bot, User, Calendar, Clock, Star } from 'lucide-react';
import { AITutorSession } from './AITutorSession';
import { TavusConversation } from './TavusConversation';

export function LearnTab() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'ai' | 'human' | 'tavus'>('ai');
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

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

  const enrolledTutors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      avatar: '/api/placeholder/60/60',
      rating: 4.9,
      isOnline: true,
      nextSession: '2024-01-20 14:00',
      totalSessions: 24
    },
    {
      id: '2', 
      name: 'Prof. Michael Chen',
      subject: 'Physics',
      avatar: '/api/placeholder/60/60',
      rating: 4.8,
      isOnline: false,
      nextSession: '2024-01-21 10:30',
      totalSessions: 18
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      subject: 'Chemistry', 
      avatar: '/api/placeholder/60/60',
      rating: 4.9,
      isOnline: true,
      nextSession: '2024-01-22 16:00',
      totalSessions: 31
    }
  ];

  const upcomingSessions = [
    { id: '1', tutor: 'Dr. Sarah Johnson', subject: 'Mathematics', date: '2024-01-20', time: '14:00', type: 'Algebra Review' },
    { id: '2', tutor: 'Prof. Michael Chen', subject: 'Physics', date: '2024-01-21', time: '10:30', type: 'Quantum Mechanics' },
    { id: '3', tutor: 'Dr. Emily Rodriguez', subject: 'Chemistry', date: '2024-01-22', time: '16:00', type: 'Organic Chemistry' }
  ];

  const startSession = (type: 'ai' | 'human' | 'tavus', tutor?: any) => {
    setSessionType(type);
    if ((type === 'tavus' || type === 'ai') && tutor) {
      setSelectedTutor(tutor);
    }
    setActiveSession(`session-${type}-${tutor?.id || 'ai'}-${Date.now()}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">Connect with your enrolled tutors and AI assistants</p>
      </div>

      {/* Enrolled Tutors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Enrolled Tutors</h3>
        <div className="space-y-4">
          {enrolledTutors.map((tutor) => (
            <div key={tutor.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
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
                    onClick={() => startSession('human', tutor)}
                    disabled={!tutor.isOnline}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tutor.isOnline
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {tutor.isOnline ? 'Start Session' : 'Schedule'}
                  </button>
                  <button
                    onClick={() => startSession('ai', tutor)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center space-x-1"
                  >
                    <Bot className="w-4 h-4" />
                    <span>AI Tutor</span>
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
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{session.type}</h4>
                  <p className="text-sm text-gray-600">{session.tutor} • {session.subject}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{session.date} at {session.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Reschedule
                </button>
                <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}