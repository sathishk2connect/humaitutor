import React, { useState } from 'react';
import { Calendar, Clock, User, Bot, Filter, Eye, MoreVertical } from 'lucide-react';

export function AllSessionsTab() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const sessions = [
    {
      id: '1',
      student: 'Alex Chen',
      tutor: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      type: 'human',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '45 min',
      status: 'completed',
      rating: 5,
      confidence: null
    },
    {
      id: '2',
      student: 'Maria Garcia',
      tutor: 'AI Assistant',
      subject: 'Physics',
      type: 'ai',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '30 min',
      status: 'completed',
      rating: 4.5,
      confidence: 87
    },
    {
      id: '3',
      student: 'John Smith',
      tutor: 'Prof. Michael Chen',
      subject: 'Chemistry',
      type: 'human',
      date: '2024-01-16',
      time: '11:00 AM',
      duration: '60 min',
      status: 'scheduled',
      rating: null,
      confidence: null
    },
    {
      id: '4',
      student: 'Sarah Wilson',
      tutor: 'AI Assistant',
      subject: 'Biology',
      type: 'ai',
      date: '2024-01-15',
      time: '4:00 PM',
      duration: '25 min',
      status: 'escalated',
      rating: null,
      confidence: 65
    },
    {
      id: '5',
      student: 'David Brown',
      tutor: 'Dr. Emily Rodriguez',
      subject: 'Mathematics',
      type: 'human',
      date: '2024-01-14',
      time: '3:30 PM',
      duration: '50 min',
      status: 'completed',
      rating: 4.8,
      confidence: null
    }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesType = filterType === 'all' || session.type === filterType;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-yellow-100 text-yellow-700';
      case 'escalated':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'ai' ? (
      <Bot className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-teal-600" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Sessions</h1>
        <p className="text-gray-600">Monitor and manage all tutoring sessions across the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="human">Human Tutor</option>
              <option value="ai">AI Tutor</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="escalated">Escalated</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Session</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date & Time</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Duration</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Performance</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{session.student}</p>
                      <p className="text-sm text-gray-600">{session.subject}</p>
                      <p className="text-xs text-gray-500">with {session.tutor}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(session.type)}
                      <span className="capitalize text-sm font-medium">
                        {session.type === 'ai' ? 'AI Tutor' : 'Human Tutor'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{session.duration}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {session.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-900">{session.rating}</span>
                        </div>
                      )}
                      {session.confidence && (
                        <div className="text-gray-600 mt-1">
                          AI: {session.confidence}%
                        </div>
                      )}
                      {!session.rating && !session.confidence && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}