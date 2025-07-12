import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  MessageCircle, 
  Calendar,
  Award,
  Users,
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Shield,
  CheckCircle,
  XCircle,
  User as UserIcon
} from 'lucide-react';
import type { User, SwapRequest, Review } from '../types';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [swapHistory, setSwapHistory] = useState<SwapRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    // Mock data - replace with API call
    const mockUser: User = {
      id: userId || '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      location: 'New York, NY',
      profilePhoto: undefined,
      skillsOffered: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js'],
      skillsWanted: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'AWS', 'Docker'],
      availability: ['Weekends', 'Evenings'],
      isPublic: true,
      rating: 4.8,
      totalSwaps: 12
    };

    const mockSwapHistory: SwapRequest[] = [
      {
        id: '1',
        fromUserId: userId || '1',
        toUserId: '2',
        skillOffered: 'React',
        skillWanted: 'Python',
        status: 'completed',
        message: 'Would love to learn Python basics in exchange for React tutoring',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        fromUserId: '3',
        toUserId: userId || '1',
        skillOffered: 'Design',
        skillWanted: 'JavaScript',
        status: 'completed',
        message: 'Looking to improve my JS skills',
        createdAt: '2024-01-10T14:30:00Z'
      },
      {
        id: '3',
        fromUserId: userId || '1',
        toUserId: '4',
        skillOffered: 'Node.js',
        skillWanted: 'AWS',
        status: 'pending',
        message: 'Interested in learning cloud deployment',
        createdAt: '2024-01-20T09:15:00Z'
      }
    ];

    const mockReviews: Review[] = [
      {
        id: '1',
        swapId: '1',
        reviewerId: '2',
        revieweeId: userId || '1',
        rating: 5,
        comment: 'Excellent teacher! Alice explained React concepts very clearly and was patient with my questions.',
        createdAt: '2024-01-16T15:00:00Z'
      },
      {
        id: '2',
        swapId: '2',
        reviewerId: '3',
        revieweeId: userId || '1',
        rating: 4,
        comment: 'Great session on JavaScript fundamentals. Very knowledgeable and helpful.',
        createdAt: '2024-01-11T16:30:00Z'
      }
    ];

    setUser(mockUser);
    setSwapHistory(mockSwapHistory);
    setReviews(mockReviews);
    setIsLoading(false);
  }, [userId]);

  const handleRequestSwap = () => {
    // TODO: Implement swap request functionality
    console.log('Request swap with user:', userId);
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Send message to user:', userId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto lg:mx-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  {user.location && (
                    <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      {user.location}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={handleRequestSwap}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Request Swap</span>
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 lg:mt-0"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-500 mb-1">
                    <Star className="w-5 h-5 mr-1 fill-current" />
                    <span className="font-bold text-lg">{user.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <Award className="w-5 h-5 mr-1" />
                    <span className="font-bold text-lg">{user.totalSwaps}</span>
                  </div>
                  <p className="text-sm text-gray-600">Swaps</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Users className="w-5 h-5 mr-1" />
                    <span className="font-bold text-lg">{reviews.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Available: {user.availability.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: UserIcon },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'history', label: 'Swap History', icon: Calendar }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Skills Offered */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Offered</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-100 text-green-800 font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Wanted</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsWanted.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info (only for own profile) */}
                {isOwnProfile && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-5 h-5 mr-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Shield className="w-5 h-5 mr-3" />
                        <span>Profile is {user.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">U</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Anonymous User</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {swapHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No swap history yet</p>
                  </div>
                ) : (
                  swapHistory.map(swap => (
                    <div key={swap.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              {swap.skillOffered}
                            </span>
                            <span className="text-gray-400">↔</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {swap.skillWanted}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{swap.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {swap.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {swap.status === 'pending' && (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                          {swap.status === 'rejected' && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            swap.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : swap.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;