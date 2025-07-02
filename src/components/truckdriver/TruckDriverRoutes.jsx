import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FiMapPin,
  FiClock,
  FiCalendar,
  FiTruck,
  FiSearch,
  FiInfo,
  FiFlag,
  FiNavigation,
  FiMap
} from 'react-icons/fi';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Sipocot coordinates
const SIPOCOT_CENTER = [13.7859, 122.9978]; // Latitude and Longitude of Sipocot

// Sample data - replace with actual API data later
const initialRoutes = [
  {
    id: 1,
    name: 'Route A',
    description: 'Northern Barangays Collection Route',
    barangays: [
      { name: 'Brgy. Angas', coordinates: [13.7959, 123.0078] },
      { name: 'Brgy. Bagacay', coordinates: [13.7859, 123.0178] },
      { name: 'Brgy. Bahay', coordinates: [13.7759, 123.0278] }
    ],
    schedule: 'Monday, Wednesday, Friday',
    startTime: '07:00 AM',
    estimatedDuration: '4 hours',
    status: 'active',
    type: 'Regular Collection',
    coverage: '8 kilometers',
    routeColor: '#FF0000' // Red color for Route A
  },
  {
    id: 2,
    name: 'Route B',
    description: 'Southern Barangays Collection Route',
    barangays: [
      { name: 'Brgy. Cabanbanan', coordinates: [13.7659, 122.9878] },
      { name: 'Brgy. Danlog', coordinates: [13.7559, 122.9778] },
      { name: 'Brgy. Del Rosario', coordinates: [13.7459, 122.9678] }
    ],
    schedule: 'Tuesday, Thursday, Saturday',
    startTime: '07:00 AM',
    estimatedDuration: '3.5 hours',
    status: 'scheduled',
    type: 'Regular Collection',
    coverage: '6 kilometers',
    routeColor: '#0000FF' // Blue color for Route B
  },
  {
    id: 3,
    name: 'Route C',
    description: 'Special Collection Route',
    barangays: [
      { name: 'Brgy. Kilikilihan', coordinates: [13.7759, 122.9878] },
      { name: 'Brgy. Lubogan', coordinates: [13.7859, 122.9778] },
      { name: 'Brgy. Patag', coordinates: [13.7959, 122.9678] }
    ],
    schedule: 'On-demand',
    startTime: 'Varies',
    estimatedDuration: '2 hours',
    status: 'inactive',
    type: 'Special Collection',
    coverage: '4 kilometers',
    routeColor: '#00FF00' // Green color for Route C
  }
];

export default function TruckDriverRoutes() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  // Get filtered routes
  const getFilteredRoutes = () => {
    let filtered = routes;

    if (filter !== 'all') {
      filtered = filtered.filter(route => route.status === filter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(searchLower) ||
        route.description.toLowerCase().includes(searchLower) ||
        route.barangays.some(b => b.name.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Routes</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Route Map</h2>
          <div className="h-[600px] rounded-lg overflow-hidden" style={{zIndex: 0}}>
            <MapContainer
              center={SIPOCOT_CENTER}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {getFilteredRoutes().map((route) => (
                <React.Fragment key={route.id}>
                  {route.barangays.map((barangay, index) => (
                    <Marker
                      key={`${route.id}-${index}`}
                      position={barangay.coordinates}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-semibold">{barangay.name}</h3>
                          <p className="text-sm">Route: {route.name}</p>
                          <p className="text-sm">Schedule: {route.schedule}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <Polyline
                    positions={route.barangays.map(b => b.coordinates)}
                    color={route.routeColor}
                    weight={3}
                    opacity={selectedRoute === route.id ? 1 : 0.5}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Routes List Section */}
        <div className="space-y-4">
          {getFilteredRoutes().map((route) => (
            <div
              key={route.id}
              className={`bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl transition-shadow cursor-pointer ${
                selectedRoute === route.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ borderLeftColor: route.routeColor }}
              onClick={() => setSelectedRoute(route.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{route.name}</h3>
                  <p className="text-gray-600 text-sm">{route.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                  {route.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-400" />
                  <span>{route.barangays.length} stops</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-400" />
                  <span>{route.estimatedDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <span>{route.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-gray-400" />
                  <span>{route.coverage}</span>
                </div>
              </div>

              <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Barangays:</h4>
                <div className="flex flex-wrap gap-2">
                  {route.barangays.map((barangay, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white rounded border text-sm"
                    >
                      {barangay.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
