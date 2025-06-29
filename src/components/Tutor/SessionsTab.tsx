import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MessageSquare, Video, Star, Filter } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { TutorSession } from './TutorSession';

export function SessionsTab() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await supabaseService.getSessions(user!.id, 'tutor');
      
      const formattedSessions = sessionsData.map(session => ({
        id: session.id,
        student: {
          name: session.students?.users?.name || 'Unknown Student',
          avatar: session.students?.users?.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
        },
        subject: session.subjects?.name || 'General',
        type: session.type === 'human' ? 'Live Session' : 'AI Session',
        date: new Date(session.created_at).toLocaleDateString(),
        time: new Date(session.created_at).toLocaleTimeString(),
        duration: `${session.duration_minutes || 60} min`,
        status: session.video_call_status === 'waiting' ? 'active' : session.status,
        rating: session.student_rating,
        feedback: session.student_feedback,
        earnings: `$${session.amount || 0}`,
        video_call_status: session.video_call_status
      }));
      
      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinSession = (session: any) => {
    setSelectedStudent({
      id: session.student.id,
      name: session.student.name,
      subject: session.subject,
      avatar: session.student.avatar
    });
    setActiveSession(session.id);
  };

  if (activeSession && selectedStudent) {
    return (
      <TutorSession
        sessionId={activeSession}
        studentInfo={selectedStudent}
        onEndSession={() => {
          setActiveSession(null);
          setSelectedStudent(null);
          loadSessions();
        }}
      />
    );
  }

  const mockSessions = [
    {
      id: '1',
      student: {
        name: 'Alex Chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      subject: 'Mathematics',
      type: 'Live Session',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '45 min',
      status: 'completed',
      rating: 5,
      feedback: 'Excellent explanation of quadratic equations!',
      earnings: '$45'
    },
    {
      id: '2',
      student: {
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      subject: 'Physics',
      type: 'AI Review',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '30 min',
      status: 'pending_review',
      earnings: '$0'
    },
    {
      id: '3',
      student: {
        name: 'John Smith',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      subject: 'Mathematics',
      type: 'Scheduled Session',
      date: '2024-01-16',
      time: '11:00 AM',
      duration: '60 min',
      status: 'upcoming',
      earnings: '$60'
    },
    {
      id: '4',
      student: {
        name: 'Sarah Wilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      subject: 'Physics',
      type: 'Live Session',
      date: '2024-01-14',
      time: '3:30 PM',
      duration: '50 min',
      status: 'completed',
      rating: 4.8,
      feedback: 'Great help with momentum problems.',
      earnings: '$50'
    }
  ];

  const allSessions = isLoading ? mockSessions : sessions;
  const filteredSessions = allSessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'active') return session.status === 'active' || session.video_call_status === 'waiting';
    return session.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'pending_review':
        return 'Review Needed';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage your tutoring sessions and student interactions</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter Sessions:</span>
            <div className="flex space-x-2">
              {['all', 'active', 'upcoming', 'completed', 'pending_review'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === filterOption
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption === 'all' ? 'All Sessions' : filterOption.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={session.student.avatar}
                  alt={session.student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{session.student.name}</h3>
                  <p className="text-gray-600">{session.subject}</p>
                  <p className="text-sm text-gray-500">{session.type}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                  {getStatusText(session.status)}
                </span>
                <p className="text-sm text-gray-600 mt-2">{session.earnings}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{session.time} ({session.duration})</span>
              </div>
              {session.rating && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{session.rating}/5</span>
                </div>
              )}
            </div>

            {session.feedback && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-blue-800 text-sm italic">"{session.feedback}"</p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {(session.status === 'active' || session.video_call_status === 'waiting') && (
                <>
                  <button 
                    onClick={() => joinSession(session)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>{session.video_call_status === 'waiting' ? 'Join Waiting Student' : 'Join Session'}</span>
                  </button>
                  <button 
                    onClick={() => joinSession(session)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </>
              )}
              
              {session.status === 'upcoming' && (
                <>
                  <button 
                    onClick={() => joinSession(session)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Session</span>
                  </button>
                  <button 
                    onClick={() => joinSession(session)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Student</span>
                  </button>
                </>
              )}
              
              {session.status === 'pending_review' && (
                <button className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Review AI Session</span>
                </button>
              )}
              
              {session.status === 'completed' && (
                <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>View Session Recap</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}