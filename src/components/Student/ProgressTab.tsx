import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, Award, Flame, BookOpen } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';

export function ProgressTab() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      
      if (!user) return;

      // Load student data
      const student = await supabaseService.getStudentByUserId(user.id);
      setStudentData(student);

      // Load badges
      const allBadges = await supabaseService.getBadges();
      const studentBadges = await supabaseService.getStudentBadges(student.id);
      const earnedBadgeIds = studentBadges.map(sb => sb.badge_id);
      
      const badgesWithStatus = allBadges.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge.id)
      }));
      setBadges(badgesWithStatus);

      // Load sessions for recent achievements
      const userSessions = await supabaseService.getSessions(user.id, user.role);
      setSessions(userSessions);

    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
          <p className="text-gray-600">Loading your progress...</p>
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

  const stats = [
    { 
      label: 'Total Sessions', 
      value: studentData?.total_sessions?.toString() || '0', 
      icon: BookOpen, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Hours Learned', 
      value: studentData?.hours_learned?.toFixed(1) || '0.0', 
      icon: Clock, 
      color: 'bg-teal-100 text-teal-600' 
    },
    { 
      label: 'Concepts Mastered', 
      value: studentData?.concepts_mastered?.toString() || '0', 
      icon: Target, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      label: 'Current Streak', 
      value: `${studentData?.current_streak || 0} days`, 
      icon: Flame, 
      color: 'bg-orange-100 text-orange-600' 
    }
  ];

  // Mock subject progress based on sessions
  const subjects = [
    { name: 'Mathematics', progress: 85, mastered: 15, total: 18 },
    { name: 'Physics', progress: 72, mastered: 13, total: 18 },
    { name: 'Chemistry', progress: 68, mastered: 12, total: 18 },
    { name: 'Biology', progress: 90, mastered: 16, total: 18 }
  ];

  const recentAchievements = sessions
    .filter(session => session.status === 'completed')
    .slice(0, 3)
    .map(session => ({
      title: `Completed ${session.subjects?.name || 'General'} Session`,
      date: new Date(session.ended_at || session.created_at).toISOString().split('T')[0],
      subject: session.subjects?.name || 'General'
    }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
        <p className="text-gray-600">Track your achievements and learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Subject Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Progress</h3>
          <div className="space-y-6">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{subject.name}</span>
                  <span className="text-sm text-gray-600">{subject.mastered}/{subject.total} concepts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{subject.progress}% Complete</span>
                  <span>{18 - subject.mastered} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
          <div className="space-y-4">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">{achievement.title}</h4>
                    <p className="text-sm text-green-700">{achievement.subject}</p>
                    <p className="text-xs text-green-600 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Complete sessions to earn achievements!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Badges & Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                badge.earned
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className={`font-semibold ${badge.earned ? 'text-yellow-900' : 'text-gray-600'}`}>
                    {badge.name}
                  </h4>
                  <p className={`text-sm ${badge.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                    {badge.description}
                  </p>
                </div>
              </div>
              {badge.earned && (
                <div className="mt-2 text-xs text-yellow-700 font-medium">
                  ✓ Earned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}