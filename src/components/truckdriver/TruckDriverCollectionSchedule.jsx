import React, { useState } from 'react';

// Sample data for each weekday
const weeklySchedules = {
  Monday: [
    { time: '6:00', barangay: 'NORTH CENTRO', color: 'bg-green-100' },
    { time: '6:30', barangay: 'SOUTH CENTRO', color: 'bg-blue-100' },
    { time: '7:00', barangay: 'IMPIG', color: 'bg-yellow-100' },
    { time: '7:00', barangay: 'TARA', color: 'bg-red-100' },
    { time: '9:00', barangay: 'NORTH CENTRO', color: 'bg-green-100' },
    { time: '9:30', barangay: 'SOUTH CENTRO', color: 'bg-blue-100' },
    { time: '11:00', barangay: 'IMPIG', color: 'bg-yellow-100' },
    { time: '11:30', barangay: 'TARA', color: 'bg-red-100' },
    { time: '12:00', barangay: 'NORTH CENTRO', color: 'bg-green-100' },
    { time: '12:30', barangay: 'SOUTH CENTRO', color: 'bg-blue-100' },
    { time: '15:00', barangay: 'NORTH CENTRO', color: 'bg-green-100' },
    { time: '15:30', barangay: 'SOUTH CENTRO', color: 'bg-blue-100' },
    { time: '14:00', barangay: 'IMPIG', color: 'bg-yellow-100' },
    { time: '14:30', barangay: 'TARA', color: 'bg-red-100' },
  ],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
};

const weekdays = [
  { label: 'M', value: 'Monday' },
  { label: 'T', value: 'Tuesday' },
  { label: 'W', value: 'Wednesday' },
  { label: 'TH', value: 'Thursday' },
  { label: 'F', value: 'Friday' },
];

export default function TruckDriverCollectionSchedule() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  // For demo, use a static date for Monday
  const dateDisplay = {
    Monday: 'May 5, 2025',
    Tuesday: 'May 6, 2025',
    Wednesday: 'May 7, 2025',
    Thursday: 'May 8, 2025',
    Friday: 'May 9, 2025',
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 pb-4 px-2">
      <div className="w-full max-w-md px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 pl-1">COLLECTION SCHEDULE</h2>
        <p className="text-sm text-gray-600 mb-4 pl-1">Welcome, Truck Driver</p>
        {/* Day Selector */}
        <div className="flex justify-center gap-2 mb-4 px-1">
          {weekdays.map((day) => (
            <button
              key={day.value}
              onClick={() => setSelectedDay(day.value)}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none ${
                selectedDay === day.value
                  ? 'bg-green-200 text-green-900'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
        {/* Card */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-center mb-4">
            <div className="font-bold text-base pb-1">{selectedDay.toUpperCase()}</div>
            <div className="text-xs text-gray-500 pb-1">{dateDisplay[selectedDay]} | 6:00 AM - 5:00 PM</div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 text-gray-600 font-semibold">TIME</th>
                  <th className="text-left px-4 py-2 text-gray-600 font-semibold">BARANGAY</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedules[selectedDay] && weeklySchedules[selectedDay].length > 0 ? (
                  weeklySchedules[selectedDay].map((row, idx) => (
                    <tr key={idx} className={row.color}>
                      <td className="px-4 py-2 font-medium">{row.time}</td>
                      <td className="px-4 py-2">{row.barangay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center text-gray-400 py-8">No schedule for this day</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      
      </div>
    </div>
  );
}
