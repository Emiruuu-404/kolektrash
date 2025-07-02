import React from 'react';
import { FiMapPin, FiClock, FiHome, FiCheck } from 'react-icons/fi';

const routes = [
  {
    id: 1,
    name: 'Route A',
    areas: ['Brgy. Looc', 'Brgy. Mabolo', 'Brgy. Luz'],
    collectionTime: '8:00 AM - 12:00 PM',
    status: 'in-progress',
    completedStops: 2,
    totalStops: 5
  },
  {
    id: 2,
    name: 'Route B',
    areas: ['Brgy. Tejero', 'Brgy. T. Padilla', 'Brgy. Carreta'],
    collectionTime: '1:00 PM - 5:00 PM',
    status: 'pending',
    completedStops: 0,
    totalStops: 4
  }
];

export default function GarbageCollectorRoutes() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Collection Routes</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage your assigned collection routes</p>
      </div>

      <div className="grid gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    <span>{route.collectionTime}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  route.status === 'in-progress'
                    ? 'bg-blue-50 text-blue-700'
                    : route.status === 'completed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {route.completedStops}/{route.totalStops} stops
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(route.completedStops / route.totalStops) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Areas */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Collection Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {route.areas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {route.status === 'pending' && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Start Collection
                  </button>
                )}
                {route.status === 'in-progress' && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Update Progress
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
