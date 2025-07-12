import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import UserCard from '../components/UserCard';
import FilterSidebar, { FilterOptions } from '../components/FilterSidebar';
import type { User } from '../types';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        location: 'New York, NY',
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning', 'Data Science'],
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
        skillsOffered: ['Python', 'Django', 'PostgreSQL'],
        skillsWanted: ['React', 'TypeScript', 'AWS'],
        availability: ['Weekdays', 'Mornings'],
        isPublic: true,
        rating: 4.6,
        totalSwaps: 8
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        location: 'Austin, TX',
        skillsOffered: ['Design', 'Figma', 'Photoshop'],
        skillsWanted: ['Frontend Development', 'CSS', 'Animation'],
        availability: ['Flexible'],
        isPublic: true,
        rating: 4.9,
        totalSwaps: 15
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        location: 'Seattle, WA',
        skillsOffered: ['Marketing', 'SEO', 'Content Writing'],
        skillsWanted: ['Social Media', 'Analytics', 'Email Marketing'],
        availability: ['Weekends'],
        isPublic: true,
        rating: 4.4,
        totalSwaps: 6
      },
      {
        id: '5',
        name: 'Eva Martinez',
        email: 'eva@example.com',
        location: 'Miami, FL',
        skillsOffered: ['Spanish', 'Translation', 'Teaching'],
        skillsWanted: ['French', 'German', 'Public Speaking'],
        availability: ['Evenings', 'Weekends'],
        isPublic: true,
        rating: 4.7,
        totalSwaps: 10
      },
      {
        id: '6',
        name: 'Frank Chen',
        email: 'frank@example.com',
        location: 'Los Angeles, CA',
        skillsOffered: ['Photography', 'Video Editing', 'Lightroom'],
        skillsWanted: ['Drone Operation', 'Color Grading', 'Motion Graphics'],
        availability: ['Weekends', 'Flexible'],
        isPublic: true,
        rating: 4.5,
        totalSwaps: 9
      }
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  const handleFiltersChange = (filters: FilterOptions) => {
    let filtered = users.filter(user => {
      // Filter by skills offered
      if (filters.skillsOffered.length > 0) {
        const hasOfferedSkill = filters.skillsOffered.some(skill =>
          user.skillsOffered.some(userSkill =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasOfferedSkill) return false;
      }

      // Filter by skills wanted
      if (filters.skillsWanted.length > 0) {
        const hasWantedSkill = filters.skillsWanted.some(skill =>
          user.skillsWanted.some(userSkill =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasWantedSkill) return false;
      }

      // Filter by location
      if (filters.location) {
        if (!user.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Filter by availability
      if (filters.availability.length > 0) {
        const hasAvailability = filters.availability.some(avail =>
          user.availability.some(userAvail =>
            userAvail.toLowerCase().includes(avail.toLowerCase())
          )
        );
        if (!hasAvailability) return false;
      }

      // Filter by minimum rating
      if (user.rating < filters.minRating) return false;

      return true;
    });

    setFilteredUsers(filtered);
  };

  const handleRequestSwap = (userId: string) => {
    // TODO: Implement swap request functionality
    console.log('Request swap with user:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Skills</h1>
            <p className="text-gray-600 mt-2">Find people to swap skills with</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found matching your criteria</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onRequestSwap={handleRequestSwap}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80">
            <FilterSidebar
              isOpen={true}
              onClose={() => setIsFilterOpen(false)}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default Dashboard;