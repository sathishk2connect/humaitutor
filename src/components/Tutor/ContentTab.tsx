import React, { useState } from 'react';
import { Upload, FileText, Video, Mic, Image, CheckCircle, Clock, X } from 'lucide-react';

export function ContentTab() {
  const [dragActive, setDragActive] = useState(false);

  const contentLibrary = [
    {
      id: '1',
      name: 'Calculus Fundamentals.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-10',
      status: 'approved',
      downloads: 47,
      tags: ['Mathematics', 'Calculus', 'Fundamentals']
    },
    {
      id: '2',
      name: 'Linear Algebra Explained.mp4',
      type: 'Video',
      size: '68.5 MB',
      uploadDate: '2024-01-12',
      status: 'pending',
      downloads: 0,
      tags: ['Mathematics', 'Linear Algebra', 'Video Tutorial']
    },
    {
      id: '3',
      name: 'Physics Problem Solving.mp3',
      type: 'Audio',
      size: '12.8 MB',
      uploadDate: '2024-01-14',
      status: 'approved',
      downloads: 23,
      tags: ['Physics', 'Problem Solving', 'Audio Guide']
    },
    {
      id: '4',
      name: 'Chemistry Diagrams.png',
      type: 'Image',
      size: '1.1 MB',
      uploadDate: '2024-01-15',
      status: 'rejected',
      downloads: 0,
      tags: ['Chemistry', 'Diagrams', 'Visual Aid'],
      rejectionReason: 'Image quality too low for educational use'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Upload and manage your educational materials</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload New Content</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </h4>
          <p className="text-gray-600 mb-4">
            Support for PDF, MP4, MP3, PNG, JPG files up to 100MB
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Choose Files
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Guidelines</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Educational content only</li>
              <li>• High quality materials preferred</li>
              <li>• Include clear titles and descriptions</li>
              <li>• Add relevant tags for discoverability</li>
              <li>• Review pending within 24 hours</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Supported Formats</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>PDF Documents</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Video className="w-4 h-4" />
                <span>MP4 Videos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mic className="w-4 h-4" />
                <span>MP3 Audio</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Image className="w-4 h-4" />
                <span>PNG/JPG Images</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Library */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Content Library</h3>
          <div className="text-sm text-gray-600">
            {contentLibrary.length} items • {contentLibrary.filter(c => c.status === 'approved').length} approved
          </div>
        </div>

        <div className="space-y-4">
          {contentLibrary.map((content) => (
            <div key={content.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(content.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{content.name}</h4>
                    <p className="text-sm text-gray-600">{content.size} • Uploaded {content.uploadDate}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {content.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(content.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                    </div>
                    {content.status === 'approved' && (
                      <p className="text-sm text-gray-600 mt-1">{content.downloads} downloads</p>
                    )}
                  </div>
                </div>
              </div>

              {content.status === 'rejected' && content.rejectionReason && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                  <p className="text-red-800 text-sm">
                    <strong>Rejection Reason:</strong> {content.rejectionReason}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                {content.status === 'approved' && (
                  <>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Share Link
                    </button>
                  </>
                )}
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}