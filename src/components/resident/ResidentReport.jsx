
import React, { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiAlertCircle, FiCamera, FiCheckCircle, FiChevronDown, FiChevronUp, FiTag } from 'react-icons/fi';
import { authService } from '../../services/authService';

const issueTypes = [
  'Missed Collection',
  'Damaged Bin',
  'Irregular Schedule',
  'Uncollected Waste',
  'Other',
];

export default function ResidentReport() {
  // State for user data and loading
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    barangay: '',
    issueType: '',
    description: '',
    photo: null,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showIssueType, setShowIssueType] = useState(false);

  // Fetch user data from database on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user data from localStorage first to get the user ID
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('No user data found. Please log in again.');
          setLoading(false);
          return;
        }

        const userDataLocal = JSON.parse(storedUser);
        console.log('Stored user data:', userDataLocal);
        
        // Fetch fresh data from database using the user ID
        if (userDataLocal.id || userDataLocal.user_id) {
          const userId = userDataLocal.id || userDataLocal.user_id;
          console.log('Fetching data for user ID:', userId);
          
          const response = await authService.getUserData(userId);
          console.log('API Response:', response);
          
          if (response.status === 'success' && response.data) {
            const user = response.data;
            setUserData(user);
            
            // Update form with fetched data
            setForm(prevForm => ({
              ...prevForm,
              name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Resident User',
              barangay: user.barangay || user.assignedArea || 'Not assigned'
            }));
            
            console.log('User data set successfully:', user);
          } else {
            console.error('Failed to fetch user data:', response.message);
            // Fallback to stored data
            setUserData(userDataLocal);
            setForm(prevForm => ({
              ...prevForm,
              name: userDataLocal.fullName || userDataLocal.name || `${userDataLocal.firstName || ''} ${userDataLocal.lastName || ''}`.trim() || 'Resident User',
              barangay: userDataLocal.barangay || userDataLocal.assignedArea || 'Not assigned'
            }));
          }
        } else {
          console.log('No user ID found, using stored data');
          // Use stored data if no ID
          setUserData(userDataLocal);
          setForm(prevForm => ({
            ...prevForm,
            name: userDataLocal.fullName || userDataLocal.name || `${userDataLocal.firstName || ''} ${userDataLocal.lastName || ''}`.trim() || 'Resident User',
            barangay: userDataLocal.barangay || userDataLocal.assignedArea || 'Not assigned'
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data. Using fallback data.');
        
        // Try to use stored data as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userDataLocal = JSON.parse(storedUser);
            setUserData(userDataLocal);
            setForm(prevForm => ({
              ...prevForm,
              name: userDataLocal.fullName || userDataLocal.name || `${userDataLocal.firstName || ''} ${userDataLocal.lastName || ''}`.trim() || 'Resident User',
              barangay: userDataLocal.barangay || userDataLocal.assignedArea || 'Not assigned'
            }));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            setError('Unable to load user data. Please log in again.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.issueType || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!form.barangay) {
      setError('Barangay information is missing. Please contact support.');
      return;
    }
    setSuccess(true);
    // Reset form but keep name and barangay
    setForm(prevForm => ({ 
      ...prevForm, 
      issueType: '', 
      description: '', 
      photo: null 
    }));
    setTimeout(() => setSuccess(false), 3000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-8 px-2">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-8 px-2">
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-green-100 p-6 flex flex-col gap-5 animate-fadeIn"
        onSubmit={handleSubmit}
        style={{ fontFamily: 'inherit' }}
      >
        <h2 className="text-2xl font-bold text-green-800 mb-2 text-center tracking-tight">Submit Report Issue</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiUser className="text-green-500" /> Name
          </label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            disabled 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none text-base" 
          />
        </div>

        {/* Barangay - Disabled */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiMapPin className="text-green-500" /> Barangay
          </label>
          <input 
            type="text" 
            name="barangay" 
            value={form.barangay || 'Not assigned'} 
            disabled 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none text-base" 
          />
          <p className="text-xs text-gray-500 mt-1">Your assigned barangay (cannot be changed)</p>
        </div>
        {/* Issue Type Dropdown */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiTag className="text-green-500" /> Issue Type <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-200 text-base"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowIssueType(prev => !prev);
            }}
            tabIndex={0}
          >
            <span className={form.issueType ? '' : 'text-gray-400'}>{form.issueType || 'Select Issue Type'}</span>
            {showIssueType ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {showIssueType && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto animate-fadeIn">
              <ul>
                {issueTypes.map((issueType) => (
                  <li
                    key={issueType}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${form.issueType === issueType ? 'bg-green-50 font-bold' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setForm(prevForm => ({ ...prevForm, issueType: issueType }));
                      setShowIssueType(false);
                    }}
                  >
                    {issueType}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 mb-0.5">Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-200 text-base bg-gray-50"
            placeholder="Describe the issue..."
          />
        </div>
        {/* Photo Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiCamera className="text-green-500" /> Photo (optional)
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {form.photo && (
            <span className="text-xs text-gray-500 mt-1">Selected: {form.photo.name}</span>
          )}
        </div>
        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 text-red-600 px-2 py-1 rounded flex items-center gap-1 text-sm justify-center">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1 text-sm justify-center font-semibold">
            <FiCheckCircle /> Report submitted successfully!
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-150 shadow-md mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}