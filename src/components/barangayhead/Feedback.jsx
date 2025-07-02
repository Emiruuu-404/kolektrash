import React, { useState } from 'react';
import { FiUser, FiMail, FiMessageCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function Feedback() {
  const [form, setForm] = useState({
    name: 'Juan Dela Cruz',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSuccess(true);
    setForm({ name: 'Juan Dela Cruz', email: '', message: '' });
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-8 px-2">
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-green-100 p-6 flex flex-col gap-5 animate-fadeIn"
        onSubmit={handleSubmit}
        style={{ fontFamily: 'inherit' }}
      >
        <h2 className="text-2xl font-bold text-green-800 mb-2 text-center tracking-tight">Submit Feedback</h2>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded px-3 py-2 text-sm">
            <FiCheckCircle /> Feedback sent successfully!
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiUser className="text-green-500" /> Name
          </label>
          <input type="text" name="name" value={form.name} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 text-base" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiMail className="text-green-500" /> Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 text-base"
            placeholder="Your email address"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-0.5">
            <FiMessageCircle className="text-green-500" /> Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 text-base resize-none"
            placeholder="Type your feedback or suggestion..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition focus:outline-green-700 focus:ring-2 focus:ring-emerald-200 mt-2"
        >
          Send Feedback
        </button>
      </form>
    </div>
  );
}
