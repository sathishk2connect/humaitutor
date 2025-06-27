import React from 'react';
import { TrendingUp, Clock, Target, Award, Flame, BookOpen } from 'lucide-react';

export function ProgressTab() {
  const stats = [
    { label: 'Total Sessions', value: '24', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { label: 'Hours Learned', value: '18.5', icon: Clock, color: 'bg-teal-100 text-teal-600' },
    { label: 'Concepts Mastered', value: '42', icon: Target, color: 'bg-green-100 text-green-600' },
    { label: 'Current Streak', value: '7 days', icon: Flame, color: 'bg-orange-100 text-orange-600' }
  ];

  const subjects = [
    { name: 'Mathematics', progress: 85, mastered: 15, total: 18 },
    { name: 'Physics', progress: 72, mastered: 13, total: 18 },
    { name: 'Chemistry', progress: 68, mastered: 12, total: 18 },
    { name: 'Biology', progress: 90, mastered: 16, total: 18 }
  ];

  const badges = [
    { name: 'Quick Learner', description: 'Completed 10 sessions', icon: '⚡', earned: true },
    { name: 'Math Wizard', description: 'Mastered 15 math concepts', icon: '🧮', earned: true },
    { name: 'Science Explorer', description: 'Studied 3 science subjects', icon: '🔬', earned: true },
    { name: 'Streak Master', description: '7-day learning streak', icon: '🔥', earned: true },
    { name: 'Knowledge Seeker', description: 'Ask 50 questions', icon: '❓', earned: false },
    { name: 'Einstein Level', description: 'Master all physics concepts', icon: '🎓', earned: false }
  ];

  const recentAchievements = [
    { title: 'Mastered Quadratic Equations', date: '2024-01-15', subject: 'Mathematics' },
    { title: 'Completed Organic Chemistry Basics', date: '2024-01-14', subject: 'Chemistry' },
    { title: 'Understood Energy Conservation', date: '2024-01-13', subject: 'Physics' }
  ];

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
            {recentAchievements.map((achievement, index) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Badges & Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
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