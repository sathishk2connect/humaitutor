import React, { useState } from 'react';
import { Star, Clock, DollarSign, Calendar, MessageSquare, Video } from 'lucide-react';

export function TutorsTab() {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const tutors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      subjects: ['Mathematics', 'Physics'],
      rating: 4.9,
      reviews: 127,
      hourlyRate: 45,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      experience: '8 years',
      availability: 'Available Now',
      description: 'PhD in Mathematics with extensive experience in calculus, algebra, and physics.',
      specialties: ['Calculus', 'Linear Algebra', 'Quantum Physics']
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      subjects: ['Biology', 'Chemistry'],
      rating: 4.8,
      reviews: 89,
      hourlyRate: 40,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      experience: '12 years',
      availability: 'Next: Tomorrow 2 PM',
      description: 'Expert in molecular biology and organic chemistry with published research.',
      specialties: ['Molecular Biology', 'Organic Chemistry', 'Biochemistry']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      subjects: ['Chemistry', 'Mathematics'],
      rating: 4.9,
      reviews: 156,
      hourlyRate: 50,
      avatar: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      experience: '10 years',
      availability: 'Available Now',
      description: 'Specialist in advanced chemistry and mathematical modeling.',
      specialties: ['Physical Chemistry', 'Statistics', 'Thermodynamics']
    },
    {
      id: '4',
      name: 'James Wilson',
      subjects: ['History', 'Literature'],
      rating: 4.7,
      reviews: 94,
      hourlyRate: 35,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      experience: '6 years',
      availability: 'Next: Today 4 PM',
      description: 'Passionate about world history and classic literature analysis.',
      specialties: ['World History', 'Shakespeare', 'Essay Writing']
    }
  ];

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature'];

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
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                selectedSubject === subject
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject === 'all' ? 'All Subjects' : subject}
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
                {tutor.specialties.map((specialty) => (
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
    </div>
  );
}