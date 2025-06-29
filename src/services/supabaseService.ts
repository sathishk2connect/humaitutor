import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Tutor = Database['public']['Tables']['tutors']['Row'];
type Student = Database['public']['Tables']['students']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Session = Database['public']['Tables']['sessions']['Row'];

export class SupabaseService {
  // Auth methods
  async signUp(email: string, password: string, userData: { name: string; role: 'student' | 'tutor' | 'admin' }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        name: userData.name,
        email: email,
        role: userData.role,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create role-specific profile
    if (userData.role === 'tutor') {
      const { error: tutorError } = await supabase
        .from('tutors')
        .insert({
          user_id: user.id,
          bio: `Experienced ${userData.name} ready to help students learn.`,
          hourly_rate: 45,
          experience_years: 5,
        });
      if (tutorError) throw tutorError;
    } else if (userData.role === 'student') {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: user.id,
        });
      if (studentError) throw studentError;
    }

    return { user: authData.user, profile: user };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return { user: data.user, profile };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) throw error;
    return { user, profile };
  }

  // User methods
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Tutor methods
  async getTutors() {
    // Get tutors first
    const { data: tutors, error: tutorsError } = await supabase
      .from('tutors')
      .select('*');

    if (tutorsError) {
      console.error('Error fetching tutors:', tutorsError);
      throw tutorsError;
    }

    if (!tutors || tutors.length === 0) {
      return [];
    }

    // Get users for these tutors
    const userIds = tutors.map(t => t.user_id);
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    // Get tutor subjects
    const tutorIds = tutors.map(t => t.id);
    const { data: tutorSubjects, error: tsError } = await supabase
      .from('tutor_subjects')
      .select(`
        tutor_id,
        subjects(*)
      `)
      .in('tutor_id', tutorIds);

    if (tsError) {
      console.error('Error fetching tutor subjects:', tsError);
    }

    // Combine the data
    const result = tutors.map(tutor => {
      const user = users?.find(u => u.id === tutor.user_id);
      const subjects = tutorSubjects?.filter(ts => ts.tutor_id === tutor.id) || [];
      
      return {
        ...tutor,
        users: user,
        tutor_subjects: subjects
      };
    });

    return result;
  }

  async getTutorById(tutorId: string) {
    const { data, error } = await supabase
      .from('tutors')
      .select(`
        *,
        users!inner(*),
        tutor_subjects(
          subjects(*)
        )
      `)
      .eq('id', tutorId)
      .single();

    if (error) throw error;
    return data;
  }

  async getTutorByUserId(userId: string) {
    const { data, error } = await supabase
      .from('tutors')
      .select(`
        *,
        users!inner(*),
        tutor_subjects(
          subjects(*)
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Student methods
  async getStudentByUserId(userId: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        users!inner(*),
        student_badges(
          badges(*)
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Subject methods
  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  // Session methods
  async getSessions(userId: string, userRole: string) {
    let sessions;
    
    if (userRole === 'student') {
      const student = await this.getStudentByUserId(userId);
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          tutors(
            users(name, avatar_url)
          ),
          subjects(name)
        `)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      sessions = data;
    } else if (userRole === 'tutor') {
      const tutor = await this.getTutorByUserId(userId);
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('tutor_id', tutor.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Manually fetch student and subject data to avoid RLS issues
      const enrichedSessions = await Promise.all(
        data.map(async (session) => {
          const [studentResult, subjectResult] = await Promise.all([
            supabase.from('students').select('users(name, avatar_url)').eq('id', session.student_id).single(),
            supabase.from('subjects').select('name').eq('id', session.subject_id).single()
          ]);
          
          return {
            ...session,
            students: studentResult.data,
            subjects: subjectResult.data
          };
        })
      );
      
      sessions = enrichedSessions;
    }

    return sessions || [];
  }

  async createSession(sessionData: {
    student_id: string;
    tutor_id?: string;
    ai_tutor_id?: string;
    subject_id: string;
    type: 'ai' | 'human' | 'hybrid';
    title?: string;
    scheduled_at?: string;
    duration_minutes?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          ...sessionData,
          status: 'scheduled',
          video_call_status: 'idle'
        })
        .select()
        .single();

      if (error) {
        console.error('Session creation error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, updates: Partial<Session>) {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async acceptSession(sessionId: string) {
    return this.updateSession(sessionId, { status: 'scheduled' });
  }

  async rejectSession(sessionId: string) {
    return this.updateSession(sessionId, { status: 'cancelled' });
  }

  // Content methods
  async getContentLibrary(tutorId?: string) {
    let query = supabase
      .from('content_library')
      .select(`
        *,
        tutors(
          users(name)
        ),
        subjects(name)
      `);

    if (tutorId) {
      query = query.eq('tutor_id', tutorId);
    } else {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Badge methods
  async getBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  async getStudentBadges(studentId: string) {
    const { data, error } = await supabase
      .from('student_badges')
      .select(`
        *,
        badges(*)
      `)
      .eq('student_id', studentId);

    if (error) throw error;
    return data;
  }

  // Analytics methods
  async getPlatformStats() {
    const [usersResult, sessionsResult, earningsResult] = await Promise.all([
      supabase.from('users').select('role', { count: 'exact' }),
      supabase.from('sessions').select('status', { count: 'exact' }),
      supabase.from('payments').select('amount').eq('status', 'paid')
    ]);

    const totalUsers = usersResult.count || 0;
    const activeSessions = sessionsResult.data?.filter(s => s.status === 'active').length || 0;
    const totalEarnings = earningsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return {
      totalUsers,
      activeSessions,
      totalEarnings,
      aiConfidence: 87.4 // This would be calculated from actual AI session data
    };
  }

  // Demo data creation
  async createDemoData() {
    try {
      // This method would be called to create demo users and sessions
      // For now, we'll rely on the seeded data and manual user creation
      console.log('Demo data creation would happen here');
    } catch (error) {
      console.error('Error creating demo data:', error);
    }
  }

  // Debug methods
  async debugTables() {
    const [users, tutors, subjects, tutorSubjects] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('tutors').select('*'),
      supabase.from('subjects').select('*'),
      supabase.from('tutor_subjects').select('*')
    ]);
    
    console.log('Users:', users.data?.length || 0);
    console.log('Tutors:', tutors.data?.length || 0);
    console.log('Subjects:', subjects.data?.length || 0);
    console.log('Tutor Subjects:', tutorSubjects.data?.length || 0);
    
    return { users: users.data, tutors: tutors.data, subjects: subjects.data, tutorSubjects: tutorSubjects.data };
  }
}

export const supabaseService = new SupabaseService();