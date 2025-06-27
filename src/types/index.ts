export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  progress: StudentProgress;
  sessions: Session[];
  preferences: StudentPreferences;
}

export interface Tutor extends User {
  role: 'tutor';
  subjects: string[];
  aiTutorId?: string;
  earnings: number;
  rating: number;
  totalSessions: number;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId?: string;
  aiTutorId?: string;
  type: 'ai' | 'human' | 'hybrid';
  subject: string;
  status: 'active' | 'completed' | 'scheduled';
  duration: number;
  transcript: string;
  videoUrl?: string;
  audioUrl?: string;
  whiteboardData?: any;
  startTime: Date;
  endTime?: Date;
  rating?: number;
  feedback?: string;
}

export interface StudentProgress {
  totalSessions: number;
  hoursLearned: number;
  conceptsMastered: string[];
  weakAreas: string[];
  streakDays: number;
  badges: Badge[];
  currentLevel: number;
  xp: number;
}

export interface StudentPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sessionDuration: number;
  notifications: boolean;
  voiceEnabled: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface AITutor {
  id: string;
  name: string;
  tutorId: string;
  subjects: string[];
  personality: string;
  confidence: number;
  totalInteractions: number;
  successRate: number;
}