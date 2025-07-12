import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, MessageCircle } from 'lucide-react';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  onRequestSwap: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onRequestSwap }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div 
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:scale-105 transition-transform"
          onClick={handleViewProfile}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleViewProfile}
          >
            {user.name}
          </h3>
          
          {user.location && (
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location}
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              {user.totalSwaps} swaps
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {user.skillsOffered.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
        <div className="flex flex-wrap gap-2">
          {user.skillsWanted.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {user.skillsWanted.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{user.skillsWanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>Available: {user.availability.join(', ')}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex space-x-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
        >
          View Profile
        </button>
        <button
          onClick={() => onRequestSwap(user.id)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Request</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;