import React, { useState } from 'react';
import { Upload, FileText, Video, Mic, Bot, CheckCircle, AlertCircle, Play, User, Sparkles, Camera, Plus, Save, X } from 'lucide-react';
import { VideoReplicaModal } from './VideoReplicaModal';

export function TrainAITab() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: '1',
      name: 'Linear Algebra Lecture Notes.pdf',
      type: 'PDF',
      size: '2.4 MB',
      status: 'processed',
      uploadDate: '2024-01-14'
    },
    {
      id: '2',
      name: 'Calculus Teaching Video.mp4',
      type: 'Video',
      size: '45.2 MB',
      status: 'processing',
      uploadDate: '2024-01-15'
    }
  ]);
  
  const [videoReplicas, setVideoReplicas] = useState([
    {
      id: '1',
      name: 'Math Teaching Persona',
      videoFile: 'math_intro_video.mp4',
      status: 'ready' as const,
      createdDate: '2024-01-16',
      tavusReplicaId: 'tavus_replica_123'
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState('');
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    subject: '',
    description: '',
    type: '',
    tags: ''
  });
  const [contextForm, setContextForm] = useState({
    expertise: '',
    targetLevel: '',
    traits: ''
  });
  
  const currentTutor = {
    id: 'tutor_123',
    name: 'Dr. Sarah Johnson',
    subject: 'Mathematics'
  };

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

  const handleReplicaCreated = (newReplica: any) => {
    setVideoReplicas(prev => [...prev, newReplica]);
    setIsModalOpen(false);
  };

  const saveContext = () => {
    if (!tutorContext.trim()) return;
    
    setIsSavingContext(true);
    setTimeout(() => {
      alert('Context saved successfully!');
      setIsSavingContext(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Train Your AI Tutor</h1>
        <p className="text-gray-600">Upload content and customize your AI teaching assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Teaching Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Teaching Context</h3>
              <p className="text-sm text-gray-600">Provide context for your AI tutor</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise/Subjects</label>
              <input
                type="text"
                value={contextForm.expertise}
                onChange={(e) => setContextForm(prev => ({...prev, expertise: e.target.value}))}
                placeholder="e.g., Advanced Mathematics, Calculus, Algebra"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Student Level</label>
              <select
                value={contextForm.targetLevel}
                onChange={(e) => setContextForm(prev => ({...prev, targetLevel: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select level</option>
                <option value="elementary">Elementary</option>
                <option value="middle-school">Middle School</option>
                <option value="high-school">High School</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Traits</label>
              <input
                type="text"
                value={contextForm.traits}
                onChange={(e) => setContextForm(prev => ({...prev, traits: e.target.value}))}
                placeholder="e.g., Patient, Encouraging, Detail-oriented, Humorous"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Teaching Context & Style
              </label>
              <textarea
                value={tutorContext}
                onChange={(e) => setTutorContext(e.target.value)}
                placeholder="Describe your teaching style, methodology, key concepts you focus on, and any specific approaches you use with students..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveContext}
                disabled={!tutorContext.trim() || isSavingContext}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSavingContext ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Context</span>
                  </>
                )}
              </button>
              
              <button className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Test AI Tutor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video AI Replica Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create AI Video Replica</h3>
              <p className="text-sm text-gray-600">Upload videos to create your conversational AI twin</p>
            </div>
          </div>

          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-purple-300 hover:border-purple-400 hover:bg-purple-50"
            onClick={() => setIsModalOpen(true)}
          >
            <Camera className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h4 className="text-md font-medium text-gray-900 mb-2">
              Create AI Video Replica
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload a teaching video to create your conversational AI twin
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Create Replica</span>
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-600">
            <p className="font-medium mb-1">What you can do:</p>
            <ul className="space-y-1 text-gray-500">
              <li>• Create multiple teaching personas</li>
              <li>• Have AI conversations with students</li>
              <li>• Maintain your teaching style 24/7</li>
              <li>• Scale your tutoring reach</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Training Materials */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Training Materials</h3>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Training Material</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {file.type === 'PDF' && <FileText className="w-5 h-5 text-blue-600" />}
                  {file.type === 'Video' && <Video className="w-5 h-5 text-blue-600" />}
                  {file.type === 'Audio' && <Mic className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <p className="text-sm text-gray-600">{file.size} • Uploaded {file.uploadDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {file.status === 'processed' ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Processed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upload Training Content</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm(prev => ({...prev, subject: e.target.value}))}
                    placeholder="e.g., Mathematics, Physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Training Material</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({...prev, type: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="lecture-notes">Lecture Notes</option>
                    <option value="teaching-video">Teaching Video</option>
                    <option value="audio-explanation">Audio Explanation</option>
                    <option value="example-problems">Example Problems</option>
                    <option value="quiz">Quiz/Assessment</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe the content and what students will learn from this material..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({...prev, tags: e.target.value}))}
                  placeholder="algebra, equations, beginner (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Drop files here or click to upload
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  PDF, MP4, MP3, DOCX files up to 100MB
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Files
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Video Replica Modal */}
      <VideoReplicaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReplicaCreated={handleReplicaCreated}
        existingReplicas={videoReplicas}
      />
    </div>
  );
}