import React, { useState } from 'react';
import { scheduleData } from '../../data/scheduleData';

const clusters = Object.keys(scheduleData);
const trucks = ['Truck 1', 'Truck 2'];

// Define the time slots for the grid (6:00 to 17:00, every 30 minutes)
const timeSlots = [];
for (let hour = 6; hour <= 17; hour++) {
  timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  if (hour !== 17) timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
}

const days = [
  { day: 'Mon', date: 5 },
  { day: 'Tue', date: 6 },
  { day: 'Wed', date: 7 },
  { day: 'Thu', date: 8 },
  { day: 'Fri', date: 9 },
];

export default function ManageSchedule() {
  const [selectedCluster, setSelectedCluster] = useState('Cluster A');
  const [selectedTruck, setSelectedTruck] = useState('Truck 1');
  const schedule = scheduleData[selectedCluster][selectedTruck];

  // Build a map: { 'Mon-6:00': [event, ...], ... }
  const eventMap = {};
  schedule.forEach(daySchedule => {
    daySchedule.events.forEach(event => {
      // Place event at its start time
      const key = `${daySchedule.day}-${event.time}`;
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(event);
    });
  });

  // Unified grid sizing for both trucks, but eventHeight is conditional
  const colWidth = '180px';
  const rowHeight = 100;
  const eventWidth = '220px';
  const eventHeight = selectedTruck === 'Truck 1' ? 120 : 30;
  const eventFontSize = 22;

  return (
    <div className="w-full h-full p-8 bg-gray-50" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-green-800 mb-2 font-normal tracking-tight">
          Route Management
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 m-0 font-normal">
          Track collection progress, view logs, and monitor waste management activities.
        </p>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg">May, 2025</div>
        <div className="flex items-center gap-2">
          <div className="rounded px-2 py-1 font-semibold text-xs mr-2 flex items-center">
            {trucks.map(truck => (
              <button
                key={truck}
                onClick={() => setSelectedTruck(truck)}
                className={`px-3 py-1 rounded mr-2 font-semibold text-sm transition ${
                  selectedTruck === truck 
                    ? 'bg-green-500 text-white' 
                    : 'bg-transparent text-green-70 border-green-300 hover:bg-green-100'
                }`}
              >
                {truck}
              </button>
            ))}
          </div>
          {selectedTruck === 'Truck 1' ? (
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedCluster}
              onChange={e => setSelectedCluster(e.target.value)}
            >
              {clusters.map(cluster => (
                <option key={cluster} value={cluster}>{cluster}</option>
              ))}
            </select>
          ) : (
            <span className="font-semibold text-green-700 text-base ml-2">Priority Barangay</span>
          )}
        </div>
      </div>

      {/* Unified Spacious Time Grid for Both Trucks */}
      <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
        {/* Time Grid Header */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `80px repeat(5, minmax(${colWidth}, 1fr))`,
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: '#f0fdf4',
          }}
        >
          <div className="bg-green-100 rounded-tl-lg py-2 font-semibold text-sm text-center">Time</div>
          {days.map(col => (
            <div key={col.day} className="bg-green-100 rounded-t-lg text-center text-gray-700 font-semibold text-sm py-2">
              {col.day} <span className="font-normal">{col.date}</span>
            </div>
          ))}
        </div>

        {/* Main Time Grid */}
        <div
          className="grid bg-white rounded-b-lg border border-t-0 border-gray-200"
          style={{
            gridTemplateColumns: `80px repeat(5, minmax(${colWidth}, 1fr))`,
            minHeight: 500,
          }}
        >
          {/* Time Column */}
          <div className="flex flex-col items-center pt-2">
            {timeSlots.map((slot, i) => (
              <div
                key={slot}
                className="w-full text-xs text-center text-gray-500 flex items-center justify-center"
                style={{ height: rowHeight }}
              >
                {slot}
              </div>
            ))}
          </div>
          {/* Day Columns */}
          {days.map(day => (
            <div key={day.day} className="relative flex flex-col pt-2">
              {timeSlots.map((slot, i) => {
                const key = `${day.day}-${slot}`;
                const events = eventMap[key] || [];
                return (
                  <div
                    key={slot}
                    className="w-full flex flex-col items-center justify-center"
                    style={{ height: rowHeight }}
                  >
                    {events.map((event, idx) => (
                      <div
                        key={event.label + idx}
                        className={`rounded shadow border-t-4 ${event.color} ${event.border} flex items-center justify-center mb-1`}
                        style={{ width: eventWidth, height: eventHeight, fontWeight: 700, fontSize: eventFontSize }}
                      >
                        <span className={`text-base ${event.text}`}>{event.label}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}