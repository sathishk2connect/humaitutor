import React, { useState, useEffect } from 'react';
import { Star, Clock, DollarSign, Calendar, MessageSquare, Video } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

export function TutorsTab() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [tutors, setTutors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load subjects
      const subjectsData = await supabaseService.getSubjects();
      setSubjects(subjectsData);

      // Load tutors
      const tutorsData = await supabaseService.getTutors();
      const formattedTutors = tutorsData.map(tutor => ({
        id: tutor.id,
        name: tutor.users.name,
        subjects: tutor.tutor_subjects?.map((ts: any) => ts.subjects?.name).filter(Boolean) || ['General'],
        rating: tutor.rating,
        reviews: Math.floor(Math.random() * 200) + 50, // Mock review count
        hourlyRate: tutor.hourly_rate,
        avatar: tutor.users.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        experience: `${tutor.experience_years} years`,
        availability: tutor.is_available ? 'Available Now' : 'Next: Tomorrow 2 PM',
        description: tutor.bio || `Expert in ${tutor.tutor_subjects?.[0]?.subjects?.name || 'various subjects'} with extensive teaching experience.`,
        specialties: tutor.tutor_subjects?.map((ts: any) => ts.subjects?.name).filter(Boolean) || ['General Teaching']
      }));
      setTutors(formattedTutors);

    } catch (error) {
      console.error('Error loading tutors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    if (selectedSubject === 'all') return true;
    return tutor.subjects.includes(selectedSubject);
  });

  const scheduleSession = (tutorId: string) => {
    alert(`Scheduling session with tutor ${tutorId}`);
  };

  const sendMessage = (tutorId: string) => {
    alert(`Sending message to tutor ${tutorId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Tutors</h1>
          <p className="text-gray-600">Loading available tutors...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-32 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Tutors</h1>
        <p className="text-gray-600">Connect with expert human tutors for personalized learning</p>
      </div>

      {/* Subject Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Subject</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject.name
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{tutor.subjects.join(', ')}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{tutor.rating} ({tutor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutor.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${tutor.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{tutor.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {tutor.specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  tutor.availability.includes('Available') ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-gray-600">{tutor.availability}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => sendMessage(tutor.id)}
                  className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Message</span>
                </button>
                <button
                  onClick={() => scheduleSession(tutor.id)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Schedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
          <p className="text-gray-600">Try selecting a different subject or check back later.</p>
        </div>
      )}
    </div>
  );
}