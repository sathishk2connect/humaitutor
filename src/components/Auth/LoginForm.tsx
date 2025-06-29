import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Loader2, Brain } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  onBackToHome: () => void;
}

export function LoginForm({ onToggleMode, onBackToHome }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (role: 'student' | 'tutor') => {
    const emails = {
      student: 'student@demo.com',
      tutor: 'tutor@demo.com'
    };
    setEmail(emails[role]);
    setPassword('demo123');
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">HumAITutor</h1>
            <p className="text-sm text-gray-600">Learn with the mind of a human, speed of AI</p>
          </div>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="text-center text-sm text-gray-600 mb-4">
          Demo Quick Access
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => quickLogin('student')}
            className="px-4 py-3 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            Student Demo
          </button>
          <button
            onClick={() => quickLogin('tutor')}
            className="px-4 py-3 text-sm bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium"
          >
            Tutor Demo
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
}