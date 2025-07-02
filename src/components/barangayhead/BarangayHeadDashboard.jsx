import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronRight, FiX, FiSettings, FiMessageSquare } from 'react-icons/fi';
import { MdHome, MdReport, MdEvent, MdMenuBook, MdLogout, MdPerson } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { authService } from '../../services/authService';

export default function BarangayHeadDashboard({ unreadNotifications }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage first to get the user ID
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Fetch fresh data from database using the user ID
          if (userData.id) {
            const response = await authService.getUserData(userData.id);
            if (response.status === 'success') {
              setUser(response.data);
            } else {
              console.error('Failed to fetch user data:', response.message);
              // Fallback to stored data
              setUser(userData);
            }
          } else {
            // Use stored data if no ID
            setUser(userData);
          }
        } else {
          console.warn('No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Try to use stored data as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
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

  // Barangay head info from database
  const barangayHead = {
    name: user?.fullName || 'Loading...',
    role: user?.role || 'Barangay Head',
    avatar: user?.avatar || '',
    username: user?.username || '',
    email: user?.email || '',
    assignedArea: user?.assignedArea || '',
  };

  // Quick tips
  const tips = [
    'Tip: Monitor collection schedules and reports from residents!',
    'Reminder: Coordinate with MENRO for upcoming events.',
    'Did you know? You can review feedback and suggestions from your barangay.'
  ];
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  // MENRO events carousel images
  const eventImages = [
    {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
      title: 'Tree Planting Activity',
      date: 'May 15, 2025',
      description: 'Join us in making Sipocot greener!'
    },
    {
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop',
      title: 'Coastal Cleanup Drive',
      date: 'May 20, 2025',
      description: 'Help us keep our waters clean'
    },
    {
      url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop',
      title: 'Waste Segregation Seminar',
      date: 'May 25, 2025',
      description: 'Learn proper waste management'
    },
    {
      url: 'https://images.unsplash.com/photo-1542601600647-3a722a90a76b?w=800&auto=format&fit=crop',
      title: 'Environmental Campaign',
      date: 'June 1, 2025',
      description: 'Building a sustainable future'
    }
  ];

  // Navigation links with routing
  const navLinks = [
    { label: 'Home', icon: <MdHome className="w-6 h-6" />, to: '/barangayhead', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead') navigate('/barangayhead'); } },
    { label: 'Submit Report Issue', icon: <MdReport className="w-6 h-6" />, to: '/barangayhead/report', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/report') navigate('/barangayhead/report'); } },
    { label: 'Submit Special Pick-up Request', icon: <MdEvent className="w-6 h-6" />, to: '/barangayhead/pickup', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/pickup') navigate('/barangayhead/pickup'); } },
    { label: 'View Collection Schedule', icon: <MdEvent className="w-6 h-6" />, to: '/barangayhead/schedule', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/schedule') navigate('/barangayhead/schedule'); } },
    { label: 'View Collection Reports', icon: <MdMenuBook className="w-6 h-6" />, to: '/barangayhead/collection-reports', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/collection-reports') navigate('/barangayhead/collection-reports'); } },
    { label: 'View Appointment Request', icon: <MdEvent className="w-6 h-6" />, to: '/barangayhead/appointments', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/appointments') navigate('/barangayhead/appointments'); } },
    { label: 'Access IEC Materials', icon: <MdMenuBook className="w-6 h-6" />, to: '/barangayhead/iec', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/iec') navigate('/barangayhead/iec'); } },
    { label: 'Settings', icon: <FiSettings className="w-6 h-6" />, to: '/barangayhead/settings', onClick: () => { setMenuOpen(false); if(location.pathname !== '/barangayhead/settings') navigate('/barangayhead/settings'); } },
    { label: 'Logout', icon: <MdLogout className="w-6 h-6 text-red-500" />, to: '/login', onClick: () => { setMenuOpen(false); setShowLogoutModal(true); } },
  ];

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Clear user data from localStorage
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setShowFeedback(false);
    setFeedback('');
    alert('Thank you for your feedback!');
  };

  // Cycle tips every 8 seconds
  useEffect(() => {
    if (!showTip) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length, showTip]);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots custom-dots"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 w-full max-w-full relative">
      {/* Loading state */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-700 font-medium">Loading user data...</p>
          </div>
        </div>
      )}

      {/* Hamburger Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white w-[280px] max-w-[85%] h-full shadow-xl z-50 animate-fadeInLeft flex flex-col">
            {/* Profile Section */}
            <div className="bg-gradient-to-b from-green-800 to-green-700 px-4 py-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shrink-0 shadow-lg">
                {barangayHead.avatar ? (
                  <img src={barangayHead.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <MdPerson className="w-7 h-7 text-green-800" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-base truncate">{barangayHead.name}</h2>
                <p className="text-green-100 text-sm">{barangayHead.role}</p>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <div className="space-y-1">
                {navLinks.map((link, i) => (
                  <button
                    key={link.label}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-colors
                      ${link.label === 'Logout' 
                        ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100' 
                        : 'bg-green-50/80 hover:bg-green-100 text-green-900 border border-green-100'
                      }
                      ${location.pathname === link.to ? 'border-2' : 'border'}
                    `}
                    onClick={link.onClick}
                  >
                    <span className={link.label === 'Logout' ? 'text-red-500' : 'text-green-700'}>
                      {link.icon}
                    </span>
                    <span className={`ml-3 text-sm font-medium ${link.label === 'Logout' ? 'text-red-600' : ''}`}>
                      {link.label}
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-sm w-full flex flex-col items-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-700 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition focus:outline-emerald-700 focus:ring-2 focus:ring-red-200"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-emerald-700 font-semibold shadow hover:bg-gray-50 transition focus:outline-emerald-700 focus:ring-2 focus:ring-emerald-100"
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-green-800 px-4 py-3 sticky top-0 z-10">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-full text-white hover:text-green-200 focus:outline-none transition-colors duration-150 group"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          <FiMenu className="w-6 h-6 group-hover:scale-110 group-focus:scale-110 transition-transform duration-150" />
        </button>
        <span 
          className="text-white font-bold text-lg tracking-wide cursor-pointer hover:text-green-200 transition-colors duration-150"
          onClick={() => navigate('/barangayhead')}
        >
          KolekTrash
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full text-white hover:text-green-200 focus:outline-none transition-colors duration-150 group"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            onClick={() => navigate('/barangayhead/notifications')}
          >
            <FiBell className="w-6 h-6 group-hover:scale-110 group-focus:scale-110 transition-transform duration-150" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border border-white">{unreadNotifications}</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {location.pathname === '/barangayhead' ? (
          <div className="flex-1 bg-gray-50 px-4 py-4">
            {/* Quick Tips Section */}
            <QuickTips tips={tips} tipIndex={tipIndex} showTip={showTip} setShowTip={setShowTip} />
            
            {/* Hero Section: Full-width Event Carousel */}
            <div className="relative w-full h-64 md:h-80 overflow-hidden shadow-lg mb-8 mt-4">
              <Slider {...carouselSettings} className="h-full">
                {eventImages.map((event, index) => (
                  <div key={index} className="relative h-64 md:h-80">
                    <div 
                      className="w-full h-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${event.url})` }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      
                      {/* Event Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <MdEvent className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">{event.date}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{event.title}</h3>
                        <p className="text-sm md:text-base text-gray-200">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Main Content */}
            <div className="px-0 py-0 space-y-8">
              {/* Welcome Section */}
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-700">
                  Welcome back, {barangayHead.name}!
                </p>
              </div>

              {/* Stats Section: Two-column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Collections Made */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <MdEvent className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-green-800">8</span>
                  </div>
                  <h3 className="text-sm font-semibold text-green-700 mb-1">Collections Made</h3>
                  <p className="text-xs text-gray-500">This month's total</p>
                </div>

                {/* On-time Rate */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <MdMenuBook className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-green-800">95%</span>
                  </div>
                  <h3 className="text-sm font-semibold text-green-700 mb-1">On-time Rate</h3>
                  <p className="text-xs text-gray-500">Collection efficiency</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button 
                    onClick={() => navigate('/barangayhead/report')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdReport className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Report Issue</h3>
                      <p className="text-xs text-white/80 mt-1">Submit a report</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/barangayhead/pickup')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdEvent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Special Pick-up</h3>
                      <p className="text-xs text-white/80 mt-1">Request pick-up</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/barangayhead/schedule')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdEvent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">View Schedule</h3>
                      <p className="text-xs text-white/80 mt-1">See schedule</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/barangayhead/collection-reports')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdMenuBook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">View Collection Reports</h3>
                      <p className="text-xs text-white/80 mt-1">See reports</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/barangayhead/appointments')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdEvent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">View Appointment Request</h3>
                      <p className="text-xs text-white/80 mt-1">See requests</p>
                    </div>
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/barangayhead/iec')}
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <MdMenuBook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Access IEC Materials</h3>
                    <p className="text-xs text-white/80 mt-1">View educational materials</p>
                  </div>
                </button>
              </div>

              {/* Today's Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-green-800 mb-4">Today's Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <MdEvent className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Next Collection</p>
                        <p className="text-sm text-gray-500">Monday, June 10, 2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-800">7:00 AM</p>
                      <p className="text-sm text-gray-500">Basura</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FiMessageSquare className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Pending Reports</p>
                        <p className="text-sm text-gray-500">{unreadNotifications} unread</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/barangayhead/notifications')}
                      className="p-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center justify-center"
                      aria-label="View Details"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom CSS for carousel dots */}
            <style jsx>{`
              .custom-dots {
                bottom: 20px !important;
              }
              .custom-dots li button:before {
                color: white !important;
                font-size: 12px !important;
              }
              .custom-dots li.slick-active button:before {
                color: white !important;
              }
            `}</style>
          </div>
        ) : null}
        {/* Always render nested barangay head pages here */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
      
      {/* Feedback Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 focus:outline-green-700 flex items-center gap-2"
        aria-label="Send Feedback"
        onClick={() => setShowFeedback(true)}
      >
        <FiMessageSquare className="w-6 h-6" />
      </button>
      
      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center" onSubmit={handleFeedbackSubmit}>
            <h2 className="text-xl font-bold text-green-700 mb-4">Send Feedback</h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-green-700"
              rows={4}
              placeholder="Your feedback..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required
            />
            <div className="flex gap-4 w-full">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-800 transition focus:outline-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded bg-gray-200 text-green-700 font-semibold hover:bg-gray-300 transition focus:outline-green-700"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-auto text-xs text-center text-white bg-green-800 py-2 w-full">
        © 2025 Municipality of Sipocot – MENRO. All rights reserved.
      </footer>
    </div>
  );
}

function QuickTips({ tips, tipIndex, showTip, setShowTip }) {
  if (!showTip) return null;
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">{tips[tipIndex]}</p>
            <div className="flex gap-1 mt-1">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === tipIndex ? 'bg-green-500' : 'bg-green-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <button 
          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full transition-colors bg-transparent" 
          aria-label="Close tip" 
          onClick={() => setShowTip(false)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
