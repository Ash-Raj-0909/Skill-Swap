import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  BarChart3
} from 'lucide-react';
import type { User, SwapRequest, Review } from '../types';

interface AdminStats {
  totalUsers: number;
  activeSwaps: number;
  totalReviews: number;
  averageRating: number;
  pendingReports: number;
  newUsersThisWeek: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSwaps: 0,
    totalReviews: 0,
    averageRating: 0,
    pendingReports: 0,
    newUsersThisWeek: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'reviews' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockStats: AdminStats = {
      totalUsers: 156,
      activeSwaps: 23,
      totalReviews: 89,
      averageRating: 4.6,
      pendingReports: 3,
      newUsersThisWeek: 12
    };

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        location: 'New York, NY',
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning'],
        availability: ['Weekends', 'Evenings'],
        isPublic: true,
        rating: 4.8,
        totalSwaps: 12
      },
      {
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
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        location: 'Austin, TX',
        skillsOffered: ['Design', 'Figma'],
        skillsWanted: ['JavaScript', 'CSS'],
        availability: ['Flexible'],
        isPublic: false,
        rating: 4.9,
        totalSwaps: 15
      }
    ];

    const mockSwapRequests: SwapRequest[] = [
      {
        id: '1',
        fromUserId: '1',
        toUserId: '2',
        skillOffered: 'React',
        skillWanted: 'Python',
        status: 'pending',
        message: 'Would love to learn Python basics',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        fromUserId: '2',
        toUserId: '3',
        skillOffered: 'Python',
        skillWanted: 'Design',
        status: 'accepted',
        message: 'Interested in UI/UX design',
        createdAt: '2024-01-19T14:30:00Z'
      }
    ];

    const mockReviews: Review[] = [
      {
        id: '1',
        swapId: '1',
        reviewerId: '2',
        revieweeId: '1',
        rating: 5,
        comment: 'Excellent teacher! Very patient and knowledgeable.',
        createdAt: '2024-01-18T15:00:00Z'
      },
      {
        id: '2',
        swapId: '2',
        reviewerId: '1',
        revieweeId: '3',
        rating: 4,
        comment: 'Great design insights and very helpful.',
        createdAt: '2024-01-17T16:30:00Z'
      }
    ];

    setStats(mockStats);
    setUsers(mockUsers);
    setSwapRequests(mockSwapRequests);
    setReviews(mockReviews);
    setIsLoading(false);
  }, []);

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Action failed');

      // Update local state for demo
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isPublic: action === 'activate' }
            : user
        ));
      }
    } catch (error) {
      console.error('Failed to perform user action:', error);
      // For demo, just update local state
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
      }
    }
  };

  const handleSwapAction = async (swapId: string, action: 'approve' | 'reject') => {
    try {
      // TODO: Replace with actual API call
      setSwapRequests(prev => prev.map(swap => 
        swap.id === swapId 
          ? { ...swap, status: action === 'approve' ? 'accepted' : 'rejected' }
          : swap
      ));
    } catch (error) {
      console.error('Failed to perform swap action:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      // TODO: Replace with actual API call
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!user.name.toLowerCase().includes(query) && 
          !user.email.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filterStatus === 'active' && !user.isPublic) return false;
    if (filterStatus === 'inactive' && user.isPublic) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, swaps, and platform activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSwaps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'swaps', label: 'Swaps', icon: MessageCircle },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'reports', label: 'Reports', icon: AlertTriangle }
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">New user registered: Alice Johnson</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Swap completed: React ↔ Python</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">New review submitted (5 stars)</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        View pending reports
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        Export user data
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        Send platform announcement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">{user.totalSwaps} swaps</span>
                              <span className="text-xs text-gray-500">Rating: {user.rating}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isPublic ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUserAction(user.id, user.isPublic ? 'suspend' : 'activate')}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              user.isPublic
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {user.isPublic ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Swaps Tab */}
            {activeTab === 'swaps' && (
              <div className="space-y-4">
                {swapRequests.map(swap => (
                  <div key={swap.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {swap.skillOffered}
                          </span>
                          <span className="text-gray-400">↔</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {swap.skillWanted}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{swap.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                        {swap.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleSwapAction(swap.id, 'approve')}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSwapAction(swap.id, 'reject')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
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
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending reports</p>
                <p className="text-gray-400 text-sm mt-2">All reports have been resolved</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;