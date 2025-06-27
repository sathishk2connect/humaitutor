import React, { useState } from 'react';
import { Upload, Loader, CheckCircle, AlertTriangle, Play, Settings } from 'lucide-react';
import { tavusApi } from '../../services/tavusApi';

interface VideoReplica {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  videoFile: string;
  createdDate: string;
  tavusReplicaId?: string;
}

interface TavusIntegrationProps {
  onReplicaCreated: (replica: VideoReplica) => void;
}

export function TavusIntegration({ onReplicaCreated }: TavusIntegrationProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replicaName, setReplicaName] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setReplicaName(`${file.name.split('.')[0]} Replica`);
    }
  };

  const uploadToTavus = async () => {
    if (!selectedFile || !replicaName.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Use Tavus.io API service
      const result = await tavusApi.createReplica({
        video: selectedFile,
        replica_name: replicaName,
        callback_url: `${window.location.origin}/api/tavus/callback`,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const newReplica: VideoReplica = {
        id: Date.now().toString(),
        name: replicaName,
        status: 'processing',
        videoFile: selectedFile.name,
        createdDate: new Date().toISOString().split('T')[0],
        tavusReplicaId: result.replica_id,
      };

      onReplicaCreated(newReplica);
      
      // Reset form
      setSelectedFile(null);
      setReplicaName('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error creating Tavus replica:', error);
      alert('Failed to create AI replica. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Teaching Video
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>

      {/* Replica Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Replica Name
        </label>
        <input
          type="text"
          value={replicaName}
          onChange={(e) => setReplicaName(e.target.value)}
          placeholder="Enter a name for your AI replica"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Creating AI replica...</span>
            <span className="text-purple-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={uploadToTavus}
          disabled={!selectedFile || !replicaName.trim() || isUploading}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isUploading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Create AI Replica</span>
            </>
          )}
        </button>
        
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Video Requirements</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Duration: 30 seconds to 5 minutes</li>
              <li>• Clear face visibility throughout the video</li>
              <li>• Good lighting and minimal background noise</li>
              <li>• Direct eye contact with the camera</li>
              <li>• Supported formats: MP4, MOV, AVI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}