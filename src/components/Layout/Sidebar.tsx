import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpen, 
  History, 
  TrendingUp, 
  Users, 
  Bot, 
  Upload,
  BarChart3,
  Settings,
  DollarSign,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'learn', label: 'Learn', icon: BookOpen },
          { id: 'history', label: 'Session History', icon: History },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
          { id: 'tutors', label: 'Find Tutors', icon: Users }
        ];
      case 'tutor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'train-ai', label: 'Train My AI', icon: Bot },
          { id: 'sessions', label: 'My Sessions', icon: MessageSquare },
          { id: 'content', label: 'Upload Content', icon: Upload },
          { id: 'earnings', label: 'Earnings', icon: DollarSign }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
          { id: 'users', label: 'Manage Users', icon: Users },
          { id: 'sessions', label: 'All Sessions', icon: MessageSquare },
          { id: 'content', label: 'Content Review', icon: Upload },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}