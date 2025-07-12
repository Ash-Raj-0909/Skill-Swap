import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageCircle, 
  Calendar, 
  User,
  Filter,
  Search,
  Plus,
  CheckCircle
} from 'lucide-react';
import type { Review, SwapRequest, User as UserType } from '../types';
import { useAuth } from '../context/AuthContext';

const Reviews: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedSwaps, setCompletedSwaps] = useState<SwapRequest[]>([]);
  const [users, setUsers] = useState<Record<string, UserType>>({});
  const [activeTab, setActiveTab] = useState<'received' | 'given' | 'pending'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    // Mock data - replace with API calls
    const mockReviews: Review[] = [
      {
        id: '1',
        swapId: '1',
        reviewerId: '2',
        revieweeId: currentUser?.id || '1',
        rating: 5,
        comment: 'Excellent teacher! Alice explained React concepts very clearly and was patient with my questions. Highly recommend!',
        createdAt: '2024-01-16T15:00:00Z'
      },
      {
        id: '2',
        swapId: '2',
        reviewerId: '3',
        revieweeId: currentUser?.id || '1',
        rating: 4,
        comment: 'Great session on JavaScript fundamentals. Very knowledgeable and helpful. Would swap again!',
        createdAt: '2024-01-11T16:30:00Z'
      },
      {
        id: '3',
        swapId: '3',
        reviewerId: currentUser?.id || '1',
        revieweeId: '4',
        rating: 5,
        comment: 'David is an AWS expert! Learned so much about cloud deployment. Very professional and well-prepared.',
        createdAt: '2024-01-19T14:20:00Z'
      },
      {
        id: '4',
        swapId: '4',
        reviewerId: currentUser?.id || '1',
        revieweeId: '5',
        rating: 4,
        comment: 'Eva is a fantastic Spanish teacher. Made learning fun and engaging. ¡Muchas gracias!',
        createdAt: '2024-01-17T10:45:00Z'
      }
    ];

    const mockCompletedSwaps: SwapRequest[] = [
      {
        id: '5',
        fromUserId: currentUser?.id || '1',
        toUserId: '6',
        skillOffered: 'TypeScript',
        skillWanted: 'Photography',
        status: 'completed',
        message: 'Completed swap - need to review',
        createdAt: '2024-01-20T12:00:00Z'
      },
      {
        id: '6',
        fromUserId: '7',
        toUserId: currentUser?.id || '1',
        skillOffered: 'Marketing',
        skillWanted: 'Node.js',
        status: 'completed',
        message: 'Completed swap - need to review',
        createdAt: '2024-01-18T09:30:00Z'
      }
    ];

    const mockUsers: Record<string, UserType> = {
      '2': {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        location: 'San Francisco, CA',
        skillsOffered: ['Python', 'Django'],
        skillsWanted: ['React', 'TypeScript'],
        availability: ['Weekdays'],
        isPublic: true,
        rating: 4.6,
        totalSwaps: 8
      },
      '3': {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        location: 'Austin, TX',
        skillsOffered: ['Design', 'Figma'],
        skillsWanted: ['JavaScript', 'CSS'],
        availability: ['Flexible'],
        isPublic: true,
        rating: 4.9,
        totalSwaps: 15
      },
      '4': {
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        location: 'Seattle, WA',
        skillsOffered: ['AWS', 'DevOps'],
        skillsWanted: ['React', 'Frontend'],
        availability: ['Weekends'],
        isPublic: true,
        rating: 4.4,
        totalSwaps: 6
      },
      '5': {
        id: '5',
        name: 'Eva Martinez',
        email: 'eva@example.com',
        location: 'Miami, FL',
        skillsOffered: ['Spanish', 'Translation'],
        skillsWanted: ['Node.js', 'Backend'],
        availability: ['Evenings'],
        isPublic: true,
        rating: 4.7,
        totalSwaps: 10
      },
      '6': {
        id: '6',
        name: 'Frank Chen',
        email: 'frank@example.com',
        location: 'Los Angeles, CA',
        skillsOffered: ['Photography', 'Video'],
        skillsWanted: ['TypeScript', 'React'],
        availability: ['Weekends'],
        isPublic: true,
        rating: 4.5,
        totalSwaps: 9
      },
      '7': {
        id: '7',
        name: 'Grace Kim',
        email: 'grace@example.com',
        location: 'Chicago, IL',
        skillsOffered: ['Marketing', 'SEO'],
        skillsWanted: ['Node.js', 'Backend'],
        availability: ['Evenings'],
        isPublic: true,
        rating: 4.3,
        totalSwaps: 7
      }
    };

    setReviews(mockReviews);
    setCompletedSwaps(mockCompletedSwaps);
    setUsers(mockUsers);
    setIsLoading(false);
  }, [currentUser]);

  const handleSubmitReview = async () => {
    if (!selectedSwap) return;

    try {
      const review: Review = {
        id: Date.now().toString(),
        swapId: selectedSwap.id,
        reviewerId: currentUser?.id || '1',
        revieweeId: selectedSwap.fromUserId === currentUser?.id ? selectedSwap.toUserId : selectedSwap.fromUserId,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      };

      setReviews(prev => [review, ...prev]);
      setCompletedSwaps(prev => prev.filter(swap => swap.id !== selectedSwap.id));
      setShowReviewModal(false);
      setSelectedSwap(null);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const openReviewModal = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowReviewModal(true);
  };

  const filteredReviews = reviews.filter(review => {
    // Filter by tab
    const isReceived = review.revieweeId === currentUser?.id;
    const isGiven = review.reviewerId === currentUser?.id;
    
    if (activeTab === 'received' && !isReceived) return false;
    if (activeTab === 'given' && !isGiven) return false;
    if (activeTab === 'pending') return false; // Pending reviews are handled separately

    // Filter by search query
    if (searchQuery) {
      const otherUserId = isReceived ? review.reviewerId : review.revieweeId;
      const otherUser = users[otherUserId];
      const searchLower = searchQuery.toLowerCase();
      
      if (!otherUser?.name.toLowerCase().includes(searchLower) &&
          !review.comment.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const pendingReviews = completedSwaps.filter(swap => {
    // Only show swaps where current user needs to leave a review
    const hasReviewed = reviews.some(review => 
      review.swapId === swap.id && review.reviewerId === currentUser?.id
    );
    return !hasReviewed;
  });

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Feedback</h1>
          <p className="text-gray-600 mt-2">Manage reviews and provide feedback on skill swaps</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('received')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'received'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Received ({reviews.filter(r => r.revieweeId === currentUser?.id).length})
              </button>
              <button
                onClick={() => setActiveTab('given')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'given'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Given ({reviews.filter(r => r.reviewerId === currentUser?.id).length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({pendingReviews.length})
              </button>
            </div>

            {/* Search */}
            {activeTab !== 'pending' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Pending Reviews Tab */}
          {activeTab === 'pending' && (
            <>
              {pendingReviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">All caught up!</p>
                  <p className="text-gray-400 mt-2">No pending reviews to complete</p>
                </div>
              ) : (
                pendingReviews.map(swap => {
                  const otherUserId = swap.fromUserId === currentUser?.id ? swap.toUserId : swap.fromUserId;
                  const otherUser = users[otherUserId];

                  return (
                    <div key={swap.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {otherUser?.name.charAt(0).toUpperCase() || 'U'}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Review swap with {otherUser?.name || 'Unknown User'}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                {swap.skillOffered}
                              </span>
                              <span className="text-gray-400">↔</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {swap.skillWanted}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              Completed {new Date(swap.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => openReviewModal(swap)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Write Review</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* Reviews List */}
          {activeTab !== 'pending' && (
            <>
              {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews found</p>
                  <p className="text-gray-400 mt-2">
                    {activeTab === 'received' 
                      ? "You haven't received any reviews yet"
                      : "You haven't given any reviews yet"
                    }
                  </p>
                </div>
              ) : (
                filteredReviews.map(review => {
                  const isReceived = review.revieweeId === currentUser?.id;
                  const otherUserId = isReceived ? review.reviewerId : review.revieweeId;
                  const otherUser = users[otherUserId];

                  return (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {otherUser?.name.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {isReceived ? `Review from ${otherUser?.name}` : `Review for ${otherUser?.name}`}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{review.comment}</p>

                          <div className="flex items-center text-sm text-gray-500">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Skill swap review
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedSwap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Write Review</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    How was your skill swap with{' '}
                    <span className="font-medium">
                      {users[selectedSwap.fromUserId === currentUser?.id ? selectedSwap.toUserId : selectedSwap.fromUserId]?.name}
                    </span>?
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {selectedSwap.skillOffered}
                    </span>
                    <span>↔</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {selectedSwap.skillWanted}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this skill swap..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedSwap(null);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;