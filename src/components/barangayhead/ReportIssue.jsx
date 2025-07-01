import React, { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiAlertCircle, FiCamera, FiCheckCircle, FiChevronDown, FiChevronUp, FiTag } from 'react-icons/fi';
import { authService } from '../../services/authService';

const issueTypes = [
  'Missed Collection', 'Overflowing Bins', 'Illegal Dumping', 'Damaged Bin', 'Other'
];

export default function ReportIssue() {
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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage first to get the user ID
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userDataLocal = JSON.parse(storedUser);
          
          // Fetch fresh data from database using the user ID
          if (userDataLocal.id) {
            const response = await authService.getUserData(userDataLocal.id);
            if (response.status === 'success') {
              const user = response.data;
              setUserData(user);
              setForm(prevForm => ({
                ...prevForm,
                name: user.fullName || '',
                barangay: user.barangay || ''
              }));
            } else {
              console.error('Failed to fetch user data:', response.message);
              // Fallback to stored data
              setUserData(userDataLocal);
              setForm(prevForm => ({
                ...prevForm,
                name: userDataLocal.fullName || userDataLocal.name || '',
                barangay: userDataLocal.barangay || userDataLocal.assignedArea || ''
              }));
            }
          } else {
            // Use stored data if no ID
            setUserData(userDataLocal);
            setForm(prevForm => ({
              ...prevForm,
              name: userDataLocal.fullName || userDataLocal.name || '',
              barangay: userDataLocal.barangay || userDataLocal.assignedArea || ''
            }));
          }
        } else {
          setError('No user data found. Please log in again.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user data');
        // Try to use stored data as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userDataLocal = JSON.parse(storedUser);
            setUserData(userDataLocal);
            setForm(prevForm => ({
              ...prevForm,
              name: userDataLocal.fullName || userDataLocal.name || '',
              barangay: userDataLocal.barangay || userDataLocal.assignedArea || ''
            }));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  }

  function handleSubmit(e) {
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

    // Submit to backend
    const submitReport = async () => {
      try {
        setLoading(true);
        
        const reportData = {
          reporter_id: userData?.id,
          reporter_name: form.name,
          barangay: form.barangay,
          issue_type: form.issueType,
          description: form.description,
          photo: form.photo ? form.photo.name : null // In a real implementation, you'd upload the file
        };

        const response = await authService.submitIssueReport(reportData);
        
        if (response.status === 'success') {
          setSuccess(true);
          // Reset form but keep name and barangay
          setForm(prevForm => ({ 
            ...prevForm, 
            issueType: '', 
            description: '', 
            photo: null 
          }));
          setTimeout(() => setSuccess(false), 5000);
        } else {
          setError(response.message || 'Failed to submit issue report');
        }
      } catch (error) {
        console.error('Error submitting issue report:', error);
        setError(error.message || 'Failed to submit issue report. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    submitReport();
  }

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
        
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded px-3 py-2 text-sm">
            <FiCheckCircle /> Report submitted successfully!
          </div>
        )}

        {/* Name - Disabled */}
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
          <p className="text-xs text-gray-500 mt-1">Your assigned barangay</p>
        </div>
        {/* Issue Type Dropdown */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiTag className="text-green-500" /> Issue Type <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-200 text-base"
            onClick={() => setShowIssueType(v => !v)}
            tabIndex={0}
          >
            <span className={form.issueType ? '' : 'text-gray-400'}>{form.issueType || 'Select Issue Type'}</span>
            {showIssueType ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {showIssueType && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto animate-fadeIn">
              <ul>
                {issueTypes.map((t) => (
                  <li
                    key={t}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${form.issueType === t ? 'bg-green-50 font-bold' : ''}`}
                    onClick={() => {
                      setForm(f => ({ ...f, issueType: t }));
                      setShowIssueType(false);
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiAlertCircle className="text-green-500" /> Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 text-base resize-none"
            placeholder="Describe the issue..."
            required
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
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {form.photo && (
            <div className="mt-2 flex items-center gap-2">
              <img src={URL.createObjectURL(form.photo)} alt="Preview" className="w-16 h-16 object-cover rounded border" />
              <span className="text-xs text-gray-500">{form.photo.name}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition focus:outline-green-700 focus:ring-2 focus:ring-emerald-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}
