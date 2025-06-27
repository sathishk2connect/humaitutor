import React, { useState } from 'react';
import { FileText, Video, Mic, Image, CheckCircle, X, Clock, Eye } from 'lucide-react';

export function ContentReviewTab() {
  const [filter, setFilter] = useState('pending');

  const contentItems = [
    {
      id: '1',
      title: 'Advanced Calculus Tutorial',
      type: 'Video',
      size: '45.2 MB',
      tutor: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-15',
      status: 'pending',
      subject: 'Mathematics',
      description: 'Comprehensive tutorial covering limits, derivatives, and integrals'
    },
    {
      id: '2',
      title: 'Physics Problem Solving Guide',
      type: 'PDF',
      size: '3.8 MB',
      tutor: 'Prof. Michael Chen',
      uploadDate: '2024-01-14',
      status: 'approved',
      subject: 'Physics',
      description: 'Step-by-step guide for solving complex physics problems'
    },
    {
      id: '3',
      title: 'Chemistry Lab Procedures',
      type: 'Audio',
      size: '12.5 MB',
      tutor: 'Dr. Emily Rodriguez',
      uploadDate: '2024-01-13',
      status: 'rejected',
      subject: 'Chemistry',
      description: 'Audio guide for laboratory safety and procedures',
      rejectionReason: 'Audio quality is too low for educational use'
    },
    {
      id: '4',
      title: 'Biology Diagrams Collection',
      type: 'Image',
      size: '2.1 MB',
      tutor: 'Dr. Lisa Wang',
      uploadDate: '2024-01-12',
      status: 'pending',
      subject: 'Biology',
      description: 'High-resolution diagrams of cellular structures'
    },
    {
      id: '5',
      title: 'Linear Algebra Fundamentals',
      type: 'PDF',
      size: '5.7 MB',
      tutor: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-11',
      status: 'approved',
      subject: 'Mathematics',
      description: 'Complete guide to vectors, matrices, and linear transformations'
    }
  ];

  const filteredContent = contentItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'Video':
        return <Video className="w-6 h-6 text-blue-600" />;
      case 'Audio':
        return <Mic className="w-6 h-6 text-green-600" />;
      case 'Image':
        return <Image className="w-6 h-6 text-purple-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleApprove = (id: string) => {
    alert(`Approved content item ${id}`);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please provide a rejection reason:');
    if (reason) {
      alert(`Rejected content item ${id} with reason: ${reason}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Review</h1>
        <p className="text-gray-600">Review and moderate educational content uploaded by tutors</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-900">Filter by Status:</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Content' : status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredContent.length} items • {contentItems.filter(c => c.status === 'pending').length} pending review
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getFileIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>by {item.tutor}</span>
                    <span>•</span>
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>Uploaded {item.uploadDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="capitalize">{item.status}</span>
                </span>
              </div>
            </div>

            {item.status === 'rejected' && item.rejectionReason && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                <p className="text-red-800 text-sm">
                  <strong>Rejection Reason:</strong> {item.rejectionReason}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              
              {item.status === 'approved' && (
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  View Details
                </button>
              )}
              
              {item.status === 'rejected' && (
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Request Revision
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}