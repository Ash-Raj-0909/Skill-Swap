import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  skillsOffered: string[];
  skillsWanted: string[];
  location: string;
  availability: string[];
  minRating: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    skillsOffered: [],
    skillsWanted: [],
    location: '',
    availability: [],
    minRating: 0
  });

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Design', 'Photography',
    'Marketing', 'Writing', 'Excel', 'Photoshop', 'Guitar', 'Spanish',
    'Cooking', 'Yoga', 'Public Speaking', 'Data Analysis'
  ];

  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'];

  const handleSkillToggle = (skill: string, type: 'offered' | 'wanted') => {
    const key = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = filters[key];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    const updatedFilters = { ...filters, [key]: updatedSkills };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleAvailabilityToggle = (option: string) => {
    const updatedAvailability = filters.availability.includes(option)
      ? filters.availability.filter(a => a !== option)
      : [...filters.availability, option];
    
    const updatedFilters = { ...filters, availability: updatedAvailability };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      skillsOffered: [],
      skillsWanted: [],
      location: '',
      availability: [],
      minRating: 0
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl lg:relative lg:w-full lg:shadow-none border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 mb-6"
          >
            Clear all filters
          </button>

          {/* Skills Offered Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Skills Offered</h3>
            <div className="space-y-2">
              {popularSkills.map(skill => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.skillsOffered.includes(skill)}
                    onChange={() => handleSkillToggle(skill, 'offered')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills Wanted Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Skills Wanted</h3>
            <div className="space-y-2">
              {popularSkills.map(skill => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.skillsWanted.includes(skill)}
                    onChange={() => handleSkillToggle(skill, 'wanted')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Location</h3>
            <input
              type="text"
              placeholder="Enter city or region"
              value={filters.location}
              onChange={(e) => {
                const updatedFilters = { ...filters, location: e.target.value };
                setFilters(updatedFilters);
                onFiltersChange(updatedFilters);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>
            <div className="space-y-2">
              {availabilityOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(option)}
                    onChange={() => handleAvailabilityToggle(option)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h3>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => {
                const updatedFilters = { ...filters, minRating: parseFloat(e.target.value) };
                setFilters(updatedFilters);
                onFiltersChange(updatedFilters);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="font-medium">{filters.minRating}</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;