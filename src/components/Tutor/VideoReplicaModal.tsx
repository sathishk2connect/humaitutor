import React, { useState } from 'react';
import { X, Camera, Sparkles, Play, User } from 'lucide-react';
import { TavusIntegration } from './TavusIntegration';

interface VideoReplica {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  videoFile: string;
  createdDate: string;
  tavusReplicaId?: string;
}

interface VideoReplicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplicaCreated: (replica: VideoReplica) => void;
  existingReplicas: VideoReplica[];
}

export function VideoReplicaModal({ 
  isOpen, 
  onClose, 
  onReplicaCreated, 
  existingReplicas 
}: VideoReplicaModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  if (!isOpen) return null;

  const testReplica = async (replicaId: string) => {
    // Integration with Tavus.io conversation API
    console.log('Testing replica:', replicaId);
    // This would open a test conversation with the AI replica
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Video Replica</h2>
              <p className="text-sm text-gray-600">Create your conversational AI twin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Create New Replica
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Replicas ({existingReplicas.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'create' ? (
            <div className="space-y-6">
              <div className="text-center">
                <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Create Your AI Teaching Replica
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Upload a video of yourself teaching to create an AI replica that can have 
                  conversations with students using your teaching style and personality.
                </p>
              </div>

              <TavusIntegration onReplicaCreated={onReplicaCreated} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Your AI Replicas</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Create New
                </button>
              </div>

              {existingReplicas.length > 0 ? (
                <div className="grid gap-4">
                  {existingReplicas.map((replica) => (
                    <div
                      key={replica.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{replica.name}</h4>
                            <p className="text-sm text-gray-600">
                              Created: {replica.createdDate} • Status: {replica.status}
                            </p>
                            <p className="text-xs text-gray-500">Video: {replica.videoFile}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {replica.status === 'ready' && (
                            <button
                              onClick={() => testReplica(replica.id)}
                              className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                            >
                              <Play className="w-3 h-3" />
                              <span>Test</span>
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {replica.status === 'processing' && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-purple-600 h-1 rounded-full w-2/3 animate-pulse" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Processing video...</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No AI Replicas Yet</h4>
                  <p className="text-gray-600 mb-4">
                    Create your first AI replica to start having conversations with students.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Your First Replica
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Powered by Tavus.io</span>
              <span>•</span>
              <span>Secure & Private</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}