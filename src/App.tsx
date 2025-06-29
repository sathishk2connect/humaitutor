import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { TutorDashboard } from './components/Tutor/TutorDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Homepage } from './components/Homepage/Homepage';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    switch (user?.role) {
      case 'student':
        return 'learn';
      case 'tutor':
        return 'dashboard';
      case 'admin':
        return 'overview';
      default:
        return 'learn';
    }
  });

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard activeTab={activeTab} />;
      case 'tutor':
        return <TutorDashboard activeTab={activeTab} />;
      case 'admin':
        return <AdminDashboard activeTab={activeTab} />;
      default:
        return <StudentDashboard activeTab={activeTab} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthScreen />;
  }

  return <Homepage onGetStarted={() => setShowAuth(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;