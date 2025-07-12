import React, { useState } from 'react';
import { X, Send, User, MessageCircle } from 'lucide-react';
import type { User as UserType } from '../types';
import { swapRequestsAPI } from '../services/api';
import { useLazyApi } from '../hooks/useApi';

interface RequestSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserType;
  onSuccess?: () => void;
}

const RequestSwapModal: React.FC<RequestSwapModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { execute: sendRequest, loading } = useLazyApi();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.skillOffered.trim()) {
      newErrors.skillOffered = 'Please select a skill you can offer';
    }
    if (!formData.skillWanted.trim()) {
      newErrors.skillWanted = 'Please select a skill you want to learn';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please include a message';
    }
    if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await execute(() => swapRequestsAPI.createRequest({
        toUserId: targetUser.id,
        skillOffered: formData.skillOffered,
        skillWanted: formData.skillWanted,
        message: formData.message
      }));

      // Reset form and close modal
      setFormData({ skillOffered: '', skillWanted: '', message: '' });
      setErrors({});
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to send swap request:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Request Skill Swap</h2>
              <p className="text-sm text-gray-600">with {targetUser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Skill You Offer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Can Offer
            </label>
            <select
              value={formData.skillOffered}
              onChange={(e) => handleInputChange('skillOffered', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skillOffered ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a skill you can teach</option>
              {/* You would populate this with user's offered skills */}
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="Design">Design</option>
              <option value="Photography">Photography</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
            </select>
            {errors.skillOffered && (
              <p className="text-red-600 text-sm mt-1">{errors.skillOffered}</p>
            )}
          </div>

          {/* Skill You Want */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Learn
            </label>
            <select
              value={formData.skillWanted}
              onChange={(e) => handleInputChange('skillWanted', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skillWanted ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a skill you want to learn</option>
              {targetUser.skillsOffered.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            {errors.skillWanted && (
              <p className="text-red-600 text-sm mt-1">{errors.skillWanted}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Choose from skills that {targetUser.name} offers
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={`Hi ${targetUser.name}! I'd love to learn ${formData.skillWanted || '[skill]'} from you. I can teach you ${formData.skillOffered || '[skill]'} in return. Let me know if you're interested!`}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">{errors.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Introduce yourself and explain why you're interested in this swap
            </p>
          </div>

          {/* User Info Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">About {targetUser.name}</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {targetUser.location || 'Location not specified'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                {targetUser.totalSwaps} successful swaps
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-4 h-4 mr-2 text-yellow-500">★</span>
                {targetUser.rating.toFixed(1)} rating
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestSwapModal;