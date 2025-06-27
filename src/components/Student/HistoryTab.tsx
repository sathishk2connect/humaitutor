import React, { useState } from 'react';
import { Calendar, Clock, User, Bot, Play, Star, MessageSquare } from 'lucide-react';

export function HistoryTab() {
  const [filter, setFilter] = useState('all');

  const sessions = [
    {
      id: '1',
      subject: 'Mathematics',
      type: 'AI',
      tutor: 'AI Assistant',
      date: '2024-01-15',
      duration: '45 min',
      rating: 4.8,
      transcript: 'Worked on quadratic equations and graphing...',
      status: 'completed'
    },
    {
      id: '2',
      subject: 'Physics',
      type: 'Human',
      tutor: 'Dr. Sarah Johnson',
      date: '2024-01-14',
      duration: '60 min',
      rating: 5.0,
      transcript: 'Discussed momentum and energy conservation...',
      status: 'completed'
    },
    {
      id: '3',
      subject: 'Chemistry',
      type: 'AI',
      tutor: 'AI Assistant',
      date: '2024-01-13',
      duration: '30 min',
      rating: 4.5,
      transcript: 'Covered organic chemistry basics...',
      status: 'completed'
    },
    {
      id: '4',
      subject: 'Biology',
      type: 'Human',
      tutor: 'Prof. Michael Chen',
      date: '2024-01-12',
      duration: '50 min',
      rating: 4.9,
      transcript: 'Explored cellular respiration processes...',
      status: 'completed'
    }
  ];

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.type.toLowerCase() === filter;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session History</h1>
        <p className="text-gray-600">Review your past learning sessions and progress</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filter Sessions</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'ai'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => setFilter('human')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'human'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Human Tutor
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    session.type === 'AI' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-teal-100 text-teal-600'
                  }`}>
                    {session.type === 'AI' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                    <p className="text-sm text-gray-600">with {session.tutor}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{session.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{session.transcript}</p>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Replay Session</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">View Transcript</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}