import React from 'react';
import { Users, Clock, DollarSign, TrendingUp, Bot, Star, Calendar, MessageSquare } from 'lucide-react';

export function DashboardTab() {
  const stats = [
    { label: 'Total Students', value: '47', icon: Users, color: 'bg-blue-100 text-blue-600', change: '+12%' },
    { label: 'Hours Taught', value: '128', icon: Clock, color: 'bg-teal-100 text-teal-600', change: '+8%' },
    { label: 'Total Earnings', value: '$3,240', icon: DollarSign, color: 'bg-green-100 text-green-600', change: '+15%' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'bg-orange-100 text-orange-600', change: '+0.1' }
  ];

  const recentSessions = [
    {
      id: '1',
      student: 'Alex Chen',
      subject: 'Mathematics',
      type: 'Live',
      time: '2024-01-15 10:00 AM',
      duration: '45 min',
      status: 'completed'
    },
    {
      id: '2',
      student: 'Maria Garcia',
      subject: 'Physics',
      type: 'AI Review',
      time: '2024-01-15 2:00 PM',
      duration: '30 min',
      status: 'pending'
    },
    {
      id: '3',
      student: 'John Smith',
      subject: 'Mathematics',
      type: 'Scheduled',
      time: '2024-01-16 11:00 AM',
      duration: '60 min',
      status: 'upcoming'
    }
  ];

  const aiMetrics = [
    { label: 'AI Sessions', value: '234', description: 'Total sessions by your AI clone' },
    { label: 'Confidence Rate', value: '87%', description: 'Average AI confidence score' },
    { label: 'Student Satisfaction', value: '4.7/5', description: 'Rating for AI sessions' },
    { label: 'Human Escalations', value: '12%', description: 'Sessions requiring your intervention' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. Sarah!</h1>
        <p className="text-gray-600">Here's what's happening with your tutoring today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {session.student.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.student}</p>
                    <p className="text-sm text-gray-600">{session.subject} • {session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{session.duration}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' 
                      ? 'bg-green-100 text-green-700'
                      : session.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your AI Tutor Performance</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {aiMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{metric.label}</p>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
                <span className="text-xl font-bold text-blue-600">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Schedule Session</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
            <Bot className="w-6 h-6 text-teal-600" />
            <span className="font-medium text-teal-900">Train AI Tutor</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">Student Messages</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}