import React from 'react';
import { FiCalendar, FiClock, FiTruck, FiMap } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';

// Sample data for demo
const tasks = [
  {
    id: 1,
    route: 'Gaongan Route',
    date: 'May 05, 2025',
    time: '7:00 AM - 10:00 AM',
    vehicle: 'XYZ-123',
    wasteType: 'RESIDUAL WASTE',
    status: 'pending',
  },
  {
    id: 2,
    route: 'Tara Route',
    date: 'May 05, 2025',
    time: '7:00 AM - 10:00 AM',
    vehicle: 'XYZ-123',
    wasteType: 'RESIDUAL WASTE',
    status: 'in-progress',
  },
  {
    id: 3,
    route: 'Impig Route',
    date: 'May 05, 2025',
    time: '7:00 AM - 10:00 AM',
    vehicle: 'XYZ-123',
    wasteType: 'RESIDUAL WASTE',
    status: 'completed',
  },
  {
    id: 4,
    route: 'North Route',
    date: 'May 05, 2025',
    time: '7:00 AM - 10:00 AM',
    vehicle: 'XYZ-123',
    wasteType: 'RESIDUAL WASTE',
    status: 'cancelled',
  },
  {
    id: 5,
    route: 'South Route',
    date: 'May 05, 2025',
    time: '7:00 AM - 10:00 AM',
    vehicle: 'XYZ-123',
    wasteType: 'RESIDUAL WASTE',
    status: 'pending',
  },
];

const statusMap = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function TruckDriverTask() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center py-6 px-2">
      <div className="w-full max-w-lg">
        <h1 className="text-lg font-semibold text-gray-900 mb-1 pl-1">ASSIGN TASK</h1>
        <p className="text-sm text-gray-600 mb-4 pl-1">Welcome, Truck Driver</p>
        <div className="space-y-5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-green-50 rounded-lg shadow border border-green-100 px-6 py-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-base text-gray-900">{task.route}</span>
                <a href="#" className="text-green-700 text-sm font-medium hover:underline">View Route</a>
              </div>
              <div className="flex flex-wrap gap-6 items-center mb-2">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiCalendar className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-800 font-medium">{task.date}</span>
                </div>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiClock className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-800 font-medium">{task.time}</span>
                </div>
                <div className="flex items-center gap-2 min-w-[100px]">
                  <FiTruck className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-800 font-medium">{task.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 min-w-[140px]">
                  <GiTrashCan className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-800 font-medium">{task.wasteType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[task.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                  Remarks: {statusMap[task.status]?.label || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
