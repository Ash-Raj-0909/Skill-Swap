import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send,
  User,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import type { SwapRequest, User as UserType } from '../types';
import { useAuth } from '../context/AuthContext';

const SwapRequests: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [users, setUsers] = useState<Record<string, UserType>>({});
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New request modal state
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    toUserId: '',
    skillOffered: '',
    skillWanted: '',
    message: ''
  });

  useEffect(() => {
    // Mock data - replace with API calls
    const mockRequests: SwapRequest[] = [
      {
        id: '1',
        fromUserId: '2',
        toUserId: currentUser?.id || '1',
        skillOffered: 'Python',
        skillWanted: 'React',
        status: 'pending',
        message: 'Hi! I\'d love to learn React from you. I can teach you Python in return.',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        fromUserId: '3',
        toUserId: currentUser?.id || '1',
        skillOffered: 'Design',
        skillWanted: 'JavaScript',
        status: 'pending',
        message: 'Looking to improve my JavaScript skills. I can help with UI/UX design.',
        createdAt: '2024-01-19T14:30:00Z'
      },
      {
        id: '3',
        fromUserId: currentUser?.id || '1',
        toUserId: '4',
        skillOffered: 'React',
        skillWanted: 'AWS',
        status: 'accepted',
        message: 'Interested in learning cloud deployment. Can teach React in exchange.',
        createdAt: '2024-01-18T09:15:00Z'
      },
      {
        id: '4',
        fromUserId: currentUser?.id || '1',
        toUserId: '5',
        skillOffered: 'Node.js',
        skillWanted: 'Spanish',
        status: 'completed',
        message: 'Would love to learn Spanish! I can teach backend development.',
        createdAt: '2024-01-15T16:45:00Z'
      },
      {
        id: '5',
        fromUserId: '6',
        toUserId: currentUser?.id || '1',
        skillOffered: 'Photography',
        skillWanted: 'TypeScript',
        status: 'rejected',
        message: 'Want to learn TypeScript for better development. Can teach photography.',
        createdAt: '2024-01-14T11:20:00Z'
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
      }
    };

    setRequests(mockRequests);
    setUsers(mockUsers);
    setIsLoading(false);
  }, [currentUser]);

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      // TODO: API call to update request status
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
          : req
      ));
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  const handleSendRequest = async () => {
    try {
      // TODO: API call to send request
      const request: SwapRequest = {
        id: Date.now().toString(),
        fromUserId: currentUser?.id || '1',
        toUserId: newRequest.toUserId,
        skillOffered: newRequest.skillOffered,
        skillWanted: newRequest.skillWanted,
        status: 'pending',
        message: newRequest.message,
        createdAt: new Date().toISOString()
      };

      setRequests(prev => [request, ...prev]);
      setShowNewRequestModal(false);
      setNewRequest({ toUserId: '', skillOffered: '', skillWanted: '', message: '' });
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    // Filter by tab (received/sent)
    const isReceived = request.toUserId === currentUser?.id;
    const isSent = request.fromUserId === currentUser?.id;
    
    if (activeTab === 'received' && !isReceived) return false;
    if (activeTab === 'sent' && !isSent) return false;

    // Filter by status
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;

    // Filter by search query
    if (searchQuery) {
      const otherUserId = isReceived ? request.fromUserId : request.toUserId;
      const otherUser = users[otherUserId];
      const searchLower = searchQuery.toLowerCase();
      
      if (!otherUser?.name.toLowerCase().includes(searchLower) &&
          !request.skillOffered.toLowerCase().includes(searchLower) &&
          !request.skillWanted.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
            <p className="text-gray-600 mt-2">Manage your skill exchange requests</p>
          </div>
          
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>New Request</span>
          </button>
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
                Received ({requests.filter(r => r.toUserId === currentUser?.id).length})
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'sent'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sent ({requests.filter(r => r.fromUserId === currentUser?.id).length})
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No requests found</p>
              <p className="text-gray-400 mt-2">
                {activeTab === 'received' 
                  ? "You haven't received any swap requests yet"
                  : "You haven't sent any swap requests yet"
                }
              </p>
            </div>
          ) : (
            filteredRequests.map(request => {
              const isReceived = request.toUserId === currentUser?.id;
              const otherUserId = isReceived ? request.fromUserId : request.toUserId;
              const otherUser = users[otherUserId];

              return (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* User Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser?.name.charAt(0).toUpperCase() || 'U'}
                      </div>

                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {otherUser?.name || 'Unknown User'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Offers: {request.skillOffered}
                          </span>
                          <span className="text-gray-400">↔</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            Wants: {request.skillWanted}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">{request.message}</p>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      
                      {isReceived && request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'accept')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* New Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Swap Request</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To User ID (Demo)
                  </label>
                  <input
                    type="text"
                    value={newRequest.toUserId}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, toUserId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter user ID (2, 3, 4, 5, 6)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill You Offer
                  </label>
                  <input
                    type="text"
                    value={newRequest.skillOffered}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, skillOffered: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What can you teach?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill You Want
                  </label>
                  <input
                    type="text"
                    value={newRequest.skillWanted}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, skillWanted: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What do you want to learn?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newRequest.message}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Introduce yourself and explain your request..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!newRequest.toUserId || !newRequest.skillOffered || !newRequest.skillWanted}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;