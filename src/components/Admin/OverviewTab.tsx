import React, { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Bot, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

export function OverviewTab() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    platformRevenue: 0,
    aiConfidence: 87.4
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlatformStats();
  }, []);

  const loadPlatformStats = async () => {
    try {
      setIsLoading(true);
      const platformStats = await supabaseService.getPlatformStats();
      setStats({
        totalUsers: platformStats.totalUsers,
        activeSessions: platformStats.activeSessions,
        platformRevenue: platformStats.totalEarnings,
        aiConfidence: platformStats.aiConfidence
      });
    } catch (error) {
      console.error('Error loading platform stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const platformStats = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600', 
      change: '+8.2%' 
    },
    { 
      label: 'Active Sessions', 
      value: stats.activeSessions.toString(), 
      icon: BookOpen, 
      color: 'bg-teal-100 text-teal-600', 
      change: '+12.5%' 
    },
    { 
      label: 'Platform Revenue', 
      value: `$${stats.platformRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-100 text-green-600', 
      change: '+15.3%' 
    },
    { 
      label: 'AI Confidence', 
      value: `${stats.aiConfidence}%`, 
      icon: Bot, 
      color: 'bg-purple-100 text-purple-600', 
      change: '+2.1%' 
    }
  ];

  const userBreakdown = [
    { role: 'Students', count: Math.floor(stats.totalUsers * 0.87), percentage: 87.3, color: 'bg-blue-500' },
    { role: 'Tutors', count: Math.floor(stats.totalUsers * 0.11), percentage: 11.4, color: 'bg-teal-500' },
    { role: 'Admins', count: Math.floor(stats.totalUsers * 0.02), percentage: 1.3, color: 'bg-orange-500' }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New tutor registered: Dr. Emily Rodriguez',
      time: '5 minutes ago',
      status: 'info'
    },
    {
      id: '2',
      type: 'content_approval',
      message: 'Content approved: Advanced Calculus Tutorial',
      time: '12 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'ai_escalation',
      message: 'AI tutor escalated session to human tutor',
      time: '18 minutes ago',
      status: 'warning'
    },
    {
      id: '4',
      type: 'payment_processed',
      message: 'Payment processed: $450 to Dr. Sarah Johnson',
      time: '25 minutes ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'content_rejected',
      message: 'Content rejected: Low quality physics diagram',
      time: '32 minutes ago',
      status: 'error'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4" />;
      case 'content_approval':
        return <CheckCircle className="w-4 h-4" />;
      case 'ai_escalation':
        return <AlertTriangle className="w-4 h-4" />;
      case 'payment_processed':
        return <DollarSign className="w-4 h-4" />;
      case 'content_rejected':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
          <p className="text-gray-600">Loading platform statistics...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
        <p className="text-gray-600">Monitor platform performance and user activity</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {platformStats.map((stat) => {
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
        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
          <div className="space-y-4">
            {userBreakdown.map((user) => (
              <div key={user.role}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{user.role}</span>
                  <span className="text-sm text-gray-600">{user.count} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${user.color}`}
                    style={{ width: `${user.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{user.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
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
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Manage Users</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <span className="font-medium text-teal-900">Review Content</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Bot className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">AI Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}