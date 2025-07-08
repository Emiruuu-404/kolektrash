import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronRight, FiX, FiSettings, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { MdHome, MdReport, MdEvent, MdMenuBook, MdLogout, MdPerson } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { authService } from '../../services/authService';

// --- QuickTips Component (copied and adapted from TruckDriverHome) ---
function QuickTips({ tips, tipIndex, setTipIndex, showTip, setShowTip }) {
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

export default function ResidentDashboard({ unreadNotifications }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showTip, setShowTip] = useState(true);
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

  // Resident info from logged-in user
  const resident = {
    name: user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : 'Resident',
    role: user?.role || 'Resident',
    avatar: '',
    username: user?.username || '',
    email: user?.email || '',
    assignedArea: user?.assignedArea || '',
  };

  // Quick tips
  const tips = [
    'Tip: You can submit a report anytime using the menu!',
    'Reminder: Collection is every Monday and Thursday.',
    'Did you know? You can view IEC materials for waste segregation tips.'
  ];
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle tips every 8 seconds
  React.useEffect(() => {
    if (!showTip) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length, showTip]);

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

  // Navigation links with routing (add Settings, remove from top bar)
  const navLinks = [
    { label: 'Home', icon: <MdHome className="w-6 h-6" />, to: '/resident', onClick: () => { setMenuOpen(false); if(location.pathname !== '/resident') navigate('/resident'); } },
    { label: 'Submit Report Issue', icon: <MdReport className="w-6 h-6" />, to: '/resident/report', onClick: () => { setMenuOpen(false); if(location.pathname !== '/resident/report') navigate('/resident/report'); } },
    { label: 'View Collection Schedule', icon: <MdEvent className="w-6 h-6" />, to: '/resident/schedule', onClick: () => { setMenuOpen(false); if(location.pathname !== '/resident/schedule') navigate('/resident/schedule'); } },
    { label: 'Access IEC Materials', icon: <MdMenuBook className="w-6 h-6" />, to: '/resident/iec', onClick: () => { setMenuOpen(false); if(location.pathname !== '/resident/iec') navigate('/resident/iec'); } },
    { label: 'Settings', icon: <FiSettings className="w-6 h-6" />, to: '/resident/settings', onClick: () => { setMenuOpen(false); if(location.pathname !== '/resident/settings') navigate('/resident/settings'); } },
    { label: 'Logout', icon: <MdLogout className="w-6 h-6 text-red-500" />, to: '/login', onClick: () => { setMenuOpen(false); setShowLogoutModal(true); } },
  ];

  const confirmLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutModal(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full max-w-full relative">
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
                {resident.avatar ? (
                  <img src={resident.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <MdPerson className="w-7 h-7 text-green-800" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-base truncate">{resident.name}</h2>
                <p className="text-green-100 text-sm">{resident.role}</p>
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
                        ? 'bg-white hover:bg-red-50 text-red-600 border border-red-100' 
                        : link.label === 'Settings'
                          ? 'bg-green-50/80 hover:bg-green-100 text-green-900 border border-green-100'
                          : 'bg-white hover:bg-green-50/50 text-[#222222] border border-gray-100'
                      }
                      ${location.pathname === link.to ? (link.label === 'Logout' ? 'border-2 border-red-400' : 'border-2 border-[#218a4c]') : 'border'}
                    `}
                    onClick={link.onClick}
                  >
                    <span className={link.label === 'Logout' ? 'text-red-500' : link.label === 'Settings' ? 'text-green-700' : 'text-[#218a4c]'}>
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
            <h2 className="text-2xl font-bold text-[#218a4c] mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-700 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition focus:outline-[#218a4c] focus:ring-2 focus:ring-red-200"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-[#218a4c] font-semibold shadow hover:bg-gray-50 transition focus:outline-[#218a4c] focus:ring-2 focus:ring-green-100"
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
          onClick={() => navigate('/resident')}
        >
          KolekTrash
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full text-white hover:text-green-200 focus:outline-none transition-colors duration-150 group"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            onClick={() => navigate('/resident/notifications')}
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
        {/* --- Main Content Container: px-4 py-4, just like TruckDriverHome --- */}
        {location.pathname === '/resident' ? (
          <div className="flex-1 bg-gray-50 px-4 py-4">
            {/* Quick Tips Section */}
            <QuickTips tips={tips} tipIndex={tipIndex} setTipIndex={setTipIndex} showTip={showTip} setShowTip={setShowTip} />
            {/* Event Carousel (Truck Driver style) */}
            <div className="relative w-full h-64 md:h-80 overflow-hidden shadow-lg mb-8 mt-4 rounded-xl">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={4000}
                arrows={false}
                dotsClass="slick-dots custom-dots"
              >
                {eventImages.map((event, index) => (
                  <div key={index} className="relative h-64 md:h-80">
                    <div
                      className="w-full h-full bg-cover bg-center relative rounded-xl"
                      style={{ backgroundImage: `url(${event.url})` }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-xl"></div>
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
              <style>{`
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
            {/* Dashboard Title and Welcome Message (Truck Driver style) */}
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-700">
                Welcome back, {resident.name}!
              </p>
            </div>
            {/* Stats Section: Two-column Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
              {/* Collections Made */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <MdEvent className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-bold text-green-800">8</span>
                </div>
                <h3 className="text-sm font-semibold text-green-700 mb-1">Collections Made</h3>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              {/* On-time Rate */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-bold text-green-800">95%</span>
                </div>
                <h3 className="text-sm font-semibold text-green-700 mb-1">On-time Rate</h3>
                <p className="text-xs text-gray-500">This week's performance</p>
              </div>
            </div>
            {/* Quick Actions Section (custom layout) */}
            <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/resident/report')}
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdReport className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Report Issue</h3>
                      <p className="text-xs text-white/80 mt-1">Submit a waste collection issue</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/resident/schedule')}
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MdEvent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">View Schedule</h3>
                      <p className="text-xs text-white/80 mt-1">See your collection schedule</p>
                    </div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => navigate('/resident/iec')}
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <MdMenuBook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Access IEC Materials</h3>
                    <p className="text-xs text-white/80 mt-1">View waste management guides</p>
                  </div>
                </div>
              </button>
            </div>
            {/* Today's Summary (Truck Driver style, for Resident) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
              <h2 className="text-xl font-bold text-green-800 mb-4">Today's Summary</h2>
              <div className="space-y-4">
                {/* Next Collection */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MdEvent className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Next Collection</p>
                      <p className="text-sm text-gray-500">Monday, June 10, 2025</p>
                      <p className="text-sm text-green-700 font-semibold">Basura <span className='text-gray-500 font-normal'>at 7:00 AM</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => navigate('/resident/schedule')}
                      className="p-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center justify-center"
                      aria-label="View Details"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Upcoming Events */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MdEvent className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 mb-1">Upcoming Events</p>
                      {eventImages.slice(0, 2).map((event, i) => (
                        <div key={i} className="mb-1">
                          <span className="font-medium text-gray-800">{event.title}</span>
                          <span className="ml-2 text-xs text-gray-500">{event.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => navigate('/resident')}
                      className="p-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center justify-center"
                      aria-label="View All Events"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* Always render nested resident pages here */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
      {/* Feedback Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-[#218a4c] text-white p-3 rounded-full shadow-lg hover:bg-[#1a6d3d] focus:outline-[#218a4c] flex items-center gap-2"
        aria-label="Send Feedback"
        onClick={() => setShowFeedback(true)}
      >
        <FiMessageSquare className="w-6 h-6" />
      </button>
      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <form className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center" onSubmit={handleFeedbackSubmit}>
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-xl font-bold text-[#218a4c]">Send Feedback</h2>
              <button 
                type="button"
                onClick={() => setShowFeedback(false)}
                className="p-1 text-gray-400 hover:text-[#218a4c] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-[#218a4c] focus:ring-2 focus:ring-green-100"
              rows={4}
              placeholder="Your feedback..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required
            />
            <div className="flex gap-4 w-full">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-[#218a4c] text-white font-semibold hover:bg-[#1a6d3d] transition focus:outline-[#218a4c] focus:ring-2 focus:ring-green-100"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg border border-gray-200 bg-white text-[#218a4c] font-semibold hover:bg-green-50 transition focus:outline-[#218a4c] focus:ring-2 focus:ring-green-100"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Footer */}
      <footer className="mt-auto text-xs text-center text-white bg-[#218a4c] py-3 w-full">
        © 2025 Municipality of Sipocot – MENRO. All rights reserved.
      </footer>
    </div>
  );
}

// Add fadeInLeft animation to App.css if not present:
// .animate-fadeInLeft { animation: fadeInLeft 0.2s ease; }
// @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1, transform: none; } }