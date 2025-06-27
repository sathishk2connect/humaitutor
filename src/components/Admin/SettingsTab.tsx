import React, { useState } from 'react';
import { Settings, Bot, DollarSign, Shield, Bell, Globe, Save } from 'lucide-react';

export function SettingsTab() {
  const [settings, setSettings] = useState({
    // AI Settings
    aiConfidenceThreshold: 70,
    autoEscalation: true,
    aiResponseTime: 2,
    
    // Platform Settings
    sessionRecording: true,
    autoTranscription: true,
    multiLanguage: false,
    
    // Payment Settings
    platformFee: 15,
    tutorPayoutDelay: 7,
    minimumPayout: 50,
    
    // Security Settings
    twoFactorAuth: false,
    sessionEncryption: true,
    dataRetention: 365,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* AI Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Tutor Configuration</h3>
              <p className="text-sm text-gray-600">Manage AI behavior and performance settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confidence Threshold for Escalation
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={settings.aiConfidenceThreshold}
                  onChange={(e) => handleSettingChange('aiConfidenceThreshold', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 w-12">
                  {settings.aiConfidenceThreshold}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI will escalate to human tutor when confidence drops below this threshold
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Response Time Limit (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.aiResponseTime}
                onChange={(e) => handleSettingChange('aiResponseTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.autoEscalation}
                  onChange={(e) => handleSettingChange('autoEscalation', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Enable automatic escalation to human tutors
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Platform Features</h3>
              <p className="text-sm text-gray-600">Control platform-wide feature availability</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Session Recording</span>
                <p className="text-xs text-gray-500">Record all tutoring sessions for review</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sessionRecording}
                onChange={(e) => handleSettingChange('sessionRecording', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Auto Transcription</span>
                <p className="text-xs text-gray-500">Automatically generate session transcripts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoTranscription}
                onChange={(e) => handleSettingChange('autoTranscription', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Multi-language Support</span>
                <p className="text-xs text-gray-500">Enable translation for international users</p>
              </div>
              <input
                type="checkbox"
                checked={settings.multiLanguage}
                onChange={(e) => handleSettingChange('multiLanguage', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Configuration</h3>
              <p className="text-sm text-gray-600">Manage payment processing and fees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Platform Fee (%)
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={settings.platformFee}
                onChange={(e) => handleSettingChange('platformFee', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Payout Delay (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.tutorPayoutDelay}
                onChange={(e) => handleSettingChange('tutorPayoutDelay', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Minimum Payout ($)
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={settings.minimumPayout}
                onChange={(e) => handleSettingChange('minimumPayout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
              <p className="text-sm text-gray-600">Configure security and data protection settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                <p className="text-xs text-gray-500">Require 2FA for all user accounts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Session Encryption</span>
                <p className="text-xs text-gray-500">Encrypt all session data and communications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sessionEncryption}
                onChange={(e) => handleSettingChange('sessionEncryption', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Data Retention Period (days)
              </label>
              <input
                type="number"
                min="30"
                max="2555"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long to retain user data and session records
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <p className="text-sm text-gray-600">Configure platform notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                <p className="text-xs text-gray-500">Send email alerts for important events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                <p className="text-xs text-gray-500">Send real-time push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Weekly Reports</span>
                <p className="text-xs text-gray-500">Send weekly platform performance reports</p>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}