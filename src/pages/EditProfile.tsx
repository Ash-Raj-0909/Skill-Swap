import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  MapPin, 
  Clock, 
  User,
  Mail,
  Shield,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User as UserType } from '../types';

const EditProfile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    isPublic: true,
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: [] as string[]
  });

  // Input states for adding new skills
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const availabilityOptions = [
    'Weekdays',
    'Weekends', 
    'Mornings',
    'Afternoons',
    'Evenings',
    'Flexible'
  ];

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Design', 'Photography',
    'Marketing', 'Writing', 'Excel', 'Photoshop', 'Guitar', 'Spanish',
    'Cooking', 'Yoga', 'Public Speaking', 'Data Analysis', 'TypeScript',
    'AWS', 'Docker', 'Machine Learning', 'Figma', 'SEO'
  ];

  useEffect(() => {
    // Load current user data - replace with API call
    const mockUserData: UserType = {
      id: currentUser?.id || '1',
      name: currentUser?.name || 'John Doe',
      email: currentUser?.email || 'john@example.com',
      location: 'New York, NY',
      skillsOffered: ['JavaScript', 'React', 'Node.js'],
      skillsWanted: ['Python', 'Machine Learning'],
      availability: ['Weekends', 'Evenings'],
      isPublic: true,
      rating: 4.8,
      totalSwaps: 12
    };

    setFormData({
      name: mockUserData.name,
      email: mockUserData.email,
      location: mockUserData.location || '',
      isPublic: mockUserData.isPublic,
      skillsOffered: mockUserData.skillsOffered,
      skillsWanted: mockUserData.skillsWanted,
      availability: mockUserData.availability
    });
    setIsLoading(false);
  }, [currentUser]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (type: 'offered' | 'wanted') => {
    const skill = type === 'offered' ? newSkillOffered : newSkillWanted;
    if (!skill.trim()) return;

    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[field];
    
    if (!currentSkills.includes(skill.trim())) {
      handleInputChange(field, [...currentSkills, skill.trim()]);
    }

    if (type === 'offered') {
      setNewSkillOffered('');
    } else {
      setNewSkillWanted('');
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', skillToRemove: string) => {
    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[field];
    handleInputChange(field, currentSkills.filter(skill => skill !== skillToRemove));
  };

  const addPopularSkill = (skill: string, type: 'offered' | 'wanted') => {
    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[field];
    
    if (!currentSkills.includes(skill)) {
      handleInputChange(field, [...currentSkills, skill]);
    }
  };

  const toggleAvailability = (option: string) => {
    const currentAvailability = formData.availability;
    if (currentAvailability.includes(option)) {
      handleInputChange('availability', currentAvailability.filter(a => a !== option));
    } else {
      handleInputChange('availability', [...currentAvailability, option]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigate('/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Shield className="w-4 h-4 ml-2 mr-2 text-gray-600" />
                <span className="text-sm text-gray-700">Make my profile public</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Public profiles can be discovered by other users
              </p>
            </div>
          </div>

          {/* Skills Offered */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills I Can Offer</h2>
            
            {/* Current Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('offered', skill)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add New Skill */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill you can teach"
                />
                <button
                  onClick={() => addSkill('offered')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular Skills */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {popularSkills.filter(skill => !formData.skillsOffered.includes(skill)).slice(0, 8).map(skill => (
                  <button
                    key={skill}
                    onClick={() => addPopularSkill(skill, 'offered')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills I Want to Learn</h2>
            
            {/* Current Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('wanted', skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add New Skill */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill you want to learn"
                />
                <button
                  onClick={() => addSkill('wanted')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular Skills */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {popularSkills.filter(skill => !formData.skillsWanted.includes(skill)).slice(0, 8).map(skill => (
                  <button
                    key={skill}
                    onClick={() => addPopularSkill(skill, 'wanted')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <Clock className="w-5 h-5 inline mr-2" />
              Availability
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availabilityOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(option)}
                    onChange={() => toggleAvailability(option)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;