import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMapPin, FiChevronDown, FiUserPlus, FiSearch } from 'react-icons/fi'
import { authService } from '../../services/authService'
import axios from "axios";

const barangays = [
  'Aldezar',
  'Alteza',
  'Anib',
  'Awayan',
  'Azucena',
  'Bagong Sirang',
  'Binahian',
  'Bolo Norte',
  'Bolo Sur',
  'Bulan',
  'Bulawan',
  'Cabuyao',
  'Caima',
  'Calagbangan',
  'Calampinay',
  'Carayrayan',
  'Cotmo',
  'Gabi',
  'Gaongan',
  'Impig',
  'Lipilip',
  'Lubigan Jr.',
  'Lubigan Sr.',
  'Malaguico',
  'Malubago',
  'Manangle',
  'Mangapo',
  'Mangga',
  'Manlubang',
  'Mantila',
  'North Centro (Poblacion)',
  'North Villazar',
  'Sagrada Familia',
  'Salanda',
  'Salvacion',
  'San Isidro',
  'San Vicente',
  'Serranzana',
  'South Centro (Poblacion)',
  'South Villazar',
  'Taisan',
  'Tara',
  'Tible',
  'Tula-tula',
  'Vigaan',
  'Yabo'
]

export default function SignUp() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    contact_num: '',
    email: '',
    username: '',
    barangay: barangays[0],
    password: '',
    confirmPassword: '',
    address: '',
    barangay_id: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [barangaySearch, setBarangaySearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleBarangaySelect = (b) => {
    setForm(prev => ({ ...prev, barangay: b, barangay_id: b, address: b }))
    setDropdownOpen(false)
    setBarangaySearch('')
  }

  const handleDropdownToggle = () => {
    setDropdownOpen((v) => !v)
    setBarangaySearch('')
  }

  const handleBarangaySearch = (e) => {
    setBarangaySearch(e.target.value)
  }

  const filteredBarangays = barangays.filter(b =>
    b.toLowerCase().includes(barangaySearch.toLowerCase())
  )

  const handleDropdownKeyDown = (e) => {
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      setBarangaySearch(e.key)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(
        "http://localhost/koletrash/backend/api/register_resident.php",
        form
      );
      setSuccess(res.data.message);
      
      // Clear form
      setForm({
        firstname: '',
        lastname: '',
        contact_num: '',
        email: '',
        username: '',
        barangay: barangays[0],
        password: '',
        confirmPassword: '',
        address: '',
        barangay_id: ''
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Enhanced loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Creating your account...</h3>
            <p className="text-sm text-gray-600 mt-2">Please wait while we set up your account</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-100 px-4 py-6">
        <div className="w-full max-w-md md:max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left side: Branding - hidden on mobile, shown on desktop */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-green-500 to-green-600 items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10 text-center text-white p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="inline-block w-5 h-5 bg-white rounded-full"></span>
                <span className="inline-block w-4 h-10 bg-green-300 rounded-sm"></span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Join KolekTrash</h1>
              <p className="text-green-100 text-lg mb-8">Smart Waste Management System</p>
              <div className="space-y-3 text-green-100">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-3 h-3 bg-green-200 rounded-full"></span>
                  <span>Easy Account Setup</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-3 h-3 bg-green-200 rounded-full"></span>
                  <span>Community Access</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-3 h-3 bg-green-200 rounded-full"></span>
                  <span>Waste Tracking</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile header - visible only on mobile */}
          <div className="md:hidden bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6 px-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              <span className="inline-block w-2 h-6 bg-green-300 rounded-sm"></span>
            </div>
            <h1 className="text-xl font-bold">Join KolekTrash</h1>
            <p className="text-green-100 text-sm mt-1">Create your account</p>
          </div>
          
          {/* Right side: SignUp form */}
          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center max-h-screen md:max-h-none overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm">Fill in your details to get started</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-md mb-4 shadow-sm">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-r-md mb-4 shadow-sm">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">First Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FiUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="firstname"
                    required
                    value={form.firstname}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your first name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FiUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastname"
                    required
                    value={form.lastname}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your last name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FiUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="contact_num"
                    required
                    value={form.contact_num}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your contact number"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FiMail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="example@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FiUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Barangay Dropdown */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Barangay</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors z-10">
                    <FiMapPin size={18} />
                  </span>
                  <select
                    name="barangay_id"
                    value={form.barangay_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Barangay</option>
                    <option value="01-ALDZR">Aldezar</option>
                    <option value="02-ALTZ">Alteza</option>
                    <option value="03-ANB">Anib</option>
                    <option value="04-AWYN">Awayan</option>
                    <option value="05-AZCN">Azucena</option>
                    <option value="06-BGNGS">Bagong Sirang</option>
                    <option value="07-BNHN">Binahian</option>
                    <option value="08-BLNRT">Bolo Norte</option>
                    <option value="09-BLSR">Bolo Sur</option>
                    <option value="10-BLN">Bulan</option>
                    <option value="11-BLWN">Bulawan</option>
                    <option value="12-CBY">Cabuyao</option>
                    <option value="13-CM">Caima</option>
                    <option value="14-CLGBN">Calagbangan</option>
                    <option value="15-CLMPN">Calampinay</option>
                    <option value="16-CRYRY">Carayrayan</option>
                    <option value="17-CTM">Cotmo</option>
                    <option value="18-GB">Gabi</option>
                    <option value="19-GNGN">Gaongan</option>
                    <option value="20-IMPG">Impig</option>
                    <option value="21-LPLP">Lipilip</option>
                    <option value="22-LBGNJ">Lubigan Jr.</option>
                    <option value="23-LBGNS">Lubigan Sr.</option>
                    <option value="24-MLGC">Malaguico</option>
                    <option value="25-MLBG">Malubago</option>
                  </select>
                </div>
              </div>

              {/* Password and Confirm Password - responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                      <FiLock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Min. 6 characters"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                      <FiLock size={18} />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Confirm password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Navigation Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 