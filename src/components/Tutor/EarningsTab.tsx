import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Users, Clock } from 'lucide-react';

export function EarningsTab() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const earningsData = {
    month: {
      total: 3240,
      human: 2880,
      ai: 360,
      sessions: 24,
      hours: 18.5
    },
    week: {
      total: 810,
      human: 720,
      ai: 90,
      sessions: 6,
      hours: 4.5
    },
    year: {
      total: 38880,
      human: 34560,
      ai: 4320,
      sessions: 288,
      hours: 222
    }
  };

  const current = earningsData[selectedPeriod as keyof typeof earningsData];

  const recentPayments = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Live Session',
      student: 'Alex Chen',
      subject: 'Mathematics',
      duration: '45 min',
      amount: 45,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-01-14',
      type: 'AI Session Revenue',
      student: 'Multiple Students',
      subject: 'Various',
      duration: '180 min',
      amount: 18,
      status: 'paid'
    },
    {
      id: '3',
      date: '2024-01-13',
      type: 'Live Session',
      student: 'Maria Garcia',
      subject: 'Physics',
      duration: '60 min',
      amount: 60,
      status: 'pending'
    },
    {
      id: '4',
      date: '2024-01-12',
      type: 'Live Session',
      student: 'John Smith',
      subject: 'Mathematics',
      duration: '50 min',
      amount: 50,
      status: 'paid'
    }
  ];

  const monthlyBreakdown = [
    { month: 'Jan', human: 2880, ai: 360 },
    { month: 'Dec', human: 2640, ai: 320 },
    { month: 'Nov', human: 2970, ai: 380 },
    { month: 'Oct', human: 3150, ai: 410 },
    { month: 'Sep', human: 2835, ai: 340 },
    { month: 'Aug', human: 3240, ai: 450 }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings Dashboard</h1>
        <p className="text-gray-600">Track your tutoring income and payment history</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <div className="flex space-x-2">
            {[
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'year', label: 'This Year' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${current.total.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last {selectedPeriod}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Human Sessions</p>
              <p className="text-2xl font-bold text-gray-900">${current.human.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">{Math.round((current.human/current.total)*100)}% of total</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${current.ai.toLocaleString()}</p>
              <p className="text-xs text-teal-600 mt-1">Passive income</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hours Taught</p>
              <p className="text-2xl font-bold text-gray-900">{current.hours}</p>
              <p className="text-xs text-orange-600 mt-1">{current.sessions} sessions</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Breakdown Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings Trend</h3>
          <div className="space-y-4">
            {monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-8">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(month.human / (month.human + month.ai)) * 100}%` }}
                    >
                      ${month.human}
                    </div>
                    <div
                      className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(month.ai / (month.human + month.ai)) * 100}%` }}
                    >
                      ${month.ai}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-16 text-right">
                  ${(month.human + month.ai).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Human Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="text-sm text-gray-600">AI Revenue</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Bank Account</p>
                  <p className="text-sm text-gray-600">•••• •••• •••• 1234</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Primary</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-600">sarah.johnson@email.com</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Set Primary
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Payout</h4>
            <p className="text-blue-800 text-sm">
              $173.50 will be transferred to your account on January 20, 2024
            </p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{payment.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{payment.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{payment.student}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{payment.duration}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">${payment.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.status}
                    </span>
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