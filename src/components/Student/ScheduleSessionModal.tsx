import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, User, Bot } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    name: string;
    subject: string;
    hourlyRate: number;
    avatar: string;
  };
  sessionType: 'human' | 'ai';
  onSchedule: (sessionData: any) => void;
}

export function ScheduleSessionModal({ isOpen, onClose, tutor, sessionType, onSchedule }: ScheduleSessionModalProps) {
  const { user } = useAuth();
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [studentBalance, setStudentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hourlyRate = sessionType === 'ai' ? Math.round(tutor.hourlyRate * 0.3) : tutor.hourlyRate;
  const totalCost = hourlyRate * duration;
  const canAfford = studentBalance >= totalCost;

  useEffect(() => {
    if (isOpen && user) {
      loadStudentBalance();
      // Set default date/time for "later" option
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      setSelectedTime('14:00');
    }
  }, [isOpen, user]);

  const loadStudentBalance = async () => {
    try {
      // Mock balance - in real app, fetch from student profile
      setStudentBalance(150); // Demo balance
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSchedule = async () => {
    if (!canAfford) return;

    setIsLoading(true);
    setMessage(null);
    try {
      const student = await supabaseService.getStudentByUserId(user!.id);
      const subjects = await supabaseService.getSubjects();
      const subject = subjects.find(s => s.name === tutor.subject) || subjects[0];

      const scheduledAt = scheduleType === 'now' 
        ? new Date().toISOString()
        : new Date(`${selectedDate}T${selectedTime}`).toISOString();

      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime.getTime() + (duration * 60 * 60 * 1000));
      
      const sessionData = {
        student_id: student.id,
        tutor_id: sessionType === 'human' ? tutor.id : undefined,
        subject_id: subject.id,
        type: sessionType,
        title: `${sessionType === 'ai' ? 'AI' : 'Human'} Session with ${tutor.name}`,
        scheduled_at: scheduledAt,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: duration * 60,
        amount: totalCost,
        status: sessionType === 'human' ? 'pending' : 'scheduled'
      };

      await supabaseService.createSession(sessionData);
      setMessage({ type: 'success', text: 'Session scheduled successfully!' });
      onSchedule(sessionData);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error scheduling session:', error);
      setMessage({ type: 'error', text: 'Failed to schedule session. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Tutor Info */}
          <div className="flex items-center space-x-3 mb-6">
            <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-medium text-gray-900">{tutor.name}</h3>
              <p className="text-sm text-gray-600">{tutor.subject}</p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
              {sessionType === 'ai' ? (
                <Bot className="w-5 h-5 text-purple-600" />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {sessionType === 'ai' ? 'AI Session' : 'Human Session'}
              </span>
            </div>
          </div>

          {/* Schedule Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">When?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScheduleType('now')}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  scheduleType === 'now'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                Start Now
              </button>
              <button
                onClick={() => setScheduleType('later')}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  scheduleType === 'later'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                Schedule Later
              </button>
            </div>
          </div>

          {/* Date/Time Selection */}
          {scheduleType === 'later' && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDuration(Math.max(1, duration - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-lg font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
              <button
                onClick={() => setDuration(duration + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Rate per hour:</span>
              <span className="font-medium">${hourlyRate}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Cost:</span>
              <span className="text-lg font-bold text-blue-600">${totalCost}</span>
            </div>
          </div>

          {/* Balance */}
          <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">Your Balance:</span>
            <span className="font-bold text-blue-900">${studentBalance}</span>
          </div>

          {/* Insufficient Balance Warning */}
          {!canAfford && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">
                Insufficient balance. You need ${totalCost - studentBalance} more to book this session.
              </p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={!canAfford || isLoading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                canAfford && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Scheduling...' : message?.type === 'success' ? '✓ Scheduled' : 'Schedule Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}