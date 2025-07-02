import React, { useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiTrash2, FiChevronDown, FiCheck, FiSend, FiUsers } from 'react-icons/fi';
import { FaUserTie, FaUserFriends, FaTimes } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with leaflet in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
];

const summary = [
  { icon: <FiUser className="inline mr-1" />, label: 'JOHN DOE', sub: 'Truck Driver' },
  { icon: <FiUser className="inline mr-1" />, label: 'IAN JAY ANONUEVO', sub: 'Garbage Collector 2' },
  { icon: <FiCalendar className="inline mr-1" />, label: 'MAY 5, 2025', sub: 'Date of Collection' },
  { icon: <FiTrash2 className="inline mr-1" />, label: '1 TONS', sub: 'Total Waste Collected' },
  { icon: <FiUser className="inline mr-1" />, label: 'EMEIR AMADO', sub: 'Garbage Collector 1' },
  { icon: <FiUser className="inline mr-1" />, label: 'ANGELA OLPATO', sub: 'Garbage Collector 3' },
  { icon: <FiClock className="inline mr-1" />, label: '10:00 AM', sub: 'Time Collected' },
  { icon: <FiCheckCircle className="inline mr-1" />, label: 'COMPLETED', sub: 'COLLECTION STATUS' },
];

// Coordinates for each barangay (sample coordinates, update as needed)
const barangayCoords = {
  'Aldezar': [13.8000, 122.9500],
  'Alteza': [13.7900, 122.9600],
  'Anib': [13.7850, 122.9700],
  'Awayan': [13.7800, 122.9800],
  'Azucena': [13.7750, 122.9900],
  'Bagong Sirang': [13.7700, 122.9950],
  'Binahian': [13.7650, 122.9850],
  'Bolo Norte': [13.7600, 122.9750],
  'Bolo Sur': [13.7550, 122.9650],
  'Bulan': [13.7500, 122.9550],
  'Bulawan': [13.7450, 122.9450],
  'Cabuyao': [13.7400, 122.9350],
  'Caima': [13.7350, 122.9250],
  'Calagbangan': [13.7300, 122.9150],
  'Calampinay': [13.7250, 122.9050],
  'Carayrayan': [13.7200, 122.8950],
  'Cotmo': [13.7150, 122.8850],
  'Gabi': [13.7100, 122.8750],
  'Gaongan': [13.7766, 122.9826], // Center
  'Impig': [13.7050, 122.8650],
  'Lipilip': [13.7000, 122.8550],
  'Lubigan Jr.': [13.6950, 122.8450],
  'Lubigan Sr.': [13.6900, 122.8350],
  'Malaguico': [13.6850, 122.8250],
  'Malubago': [13.6800, 122.8150],
  'Manangle': [13.6750, 122.8050],
  'Mangapo': [13.6700, 122.7950],
  'Mangga': [13.6650, 122.7850],
  'Manlubang': [13.6600, 122.7750],
  'Mantila': [13.6550, 122.7650],
  'North Centro (Poblacion)': [13.7760, 122.9830],
  'North Villazar': [13.6500, 122.7550],
  'Sagrada Familia': [13.6450, 122.7450],
  'Salanda': [13.6400, 122.7350],
  'Salvacion': [13.6350, 122.7250],
  'San Isidro': [13.6300, 122.7150],
  'San Vicente': [13.6250, 122.7050],
  'Serranzana': [13.6200, 122.6950],
  'South Centro (Poblacion)': [13.7755, 122.9820],
  'South Villazar': [13.6150, 122.6850],
  'Taisan': [13.6100, 122.6750],
  'Tara': [13.6050, 122.6650],
  'Tible': [13.6000, 122.6550],
  'Tula-tula': [13.5950, 122.6450],
  'Vigaan': [13.5900, 122.6350],
  'Yabo': [13.5850, 122.6250],
};

function MapUpdater({ position }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

export default function TaskManagement() {
  const [selected, setSelected] = useState(barangays[0]);
  const [filter, setFilter] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    truckDriver: '',
    garbageCollectors: [],
    date: '',
    time: '',
    taskType: 'regular',
    notes: '',
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [truckDrivers, setTruckDrivers] = useState([]);
  const [garbageCollectors, setGarbageCollectors] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingCollectors, setLoadingCollectors] = useState(true);

  // Center on selected barangay
  const center = barangayCoords[selected] || [13.7766, 122.9826];

  // Filtered barangays for sidebar
  const filteredBarangays = (filter.trim() === ''
    ? barangays.slice(0, 10)
    : barangays.filter(b => b.toLowerCase().includes(filter.toLowerCase())).slice(0, 10));

  // Assign button handler
  const handleAssign = () => {
    setShowAssignModal(true);
  };

  const handleAssignFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'garbageCollectors') {
      const id = parseInt(value);
      setAssignForm((prev) => ({
        ...prev,
        garbageCollectors: checked
          ? [...prev.garbageCollectors, id]
          : prev.garbageCollectors.filter((gc) => gc !== id),
      }));
    } else {
      setAssignForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignSuccess(null);
    // Placeholder: Replace with actual API call
    setTimeout(() => {
      setAssignLoading(false);
      setAssignSuccess('Task assigned successfully!');
      setShowAssignModal(false);
      setAssignForm({
        truckDriver: '',
        garbageCollectors: [],
        date: '',
        time: '',
        taskType: 'regular',
        notes: '',
      });
    }, 1200);
  };

  useEffect(() => {
    // Fetch truck drivers
    fetch('/backend/api/get_truck_drivers.php')
      .then(res => res.json())
      .then(data => {
        setTruckDrivers(data);
        setLoadingDrivers(false);
      })
      .catch(() => setLoadingDrivers(false));

    // Fetch garbage collectors
    fetch('/backend/api/get_garbage_collectors.php')
      .then(res => res.json())
      .then(data => {
        setGarbageCollectors(data);
        setLoadingCollectors(false);
      })
      .catch(() => setLoadingCollectors(false));
  }, []);

  return (
    <div className="p-6 max-w-full overflow-x-auto bg-green-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-green-800 mb-2 font-normal tracking-tight">
          Task Management
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 m-0 font-normal">
          Manage and assign waste collection tasks to barangays and track progress.
        </p>
      </div>

      {/* Minimal Summary Bar - Tree Palette */}
      <div className="w-full flex items-center justify-between bg-green-50 py-6 px-8 mb-8">
        {/* Left: Info Columns */}
        <div className="flex flex-1 items-start gap-20">
          {/* Column 1 */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <FiUser className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">JOHN DOE</div>
                <div className="text-xs text-green-700 font-normal">Truck Driver</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiUser className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">EMEIR AMADO</div>
                <div className="text-xs text-green-700 font-normal">Garbage Collector 1</div>
              </div>
            </div>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <FiUser className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">IAN JAY ANONUEVO</div>
                <div className="text-xs text-green-700 font-normal">Garbage Collector 2</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiUser className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">ANGELA OLPATO</div>
                <div className="text-xs text-green-700 font-normal">Garbage Collector 3</div>
              </div>
            </div>
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <FiCalendar className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">MAY 5, 2025</div>
                <div className="text-xs text-green-700 font-normal">Date Collected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">10:00 AM</div>
                <div className="text-xs text-green-700 font-normal">Time Collected</div>
              </div>
            </div>
          </div>
          {/* Column 4 */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <FiTrash2 className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">1 TONS</div>
                <div className="text-xs text-green-700 font-normal">Total Waste Collected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-6 h-6 text-green-800" />
              <div>
                <div className="text-base text-green-900 font-semibold leading-tight">COMPLETED</div>
                <div className="text-xs text-green-700 font-normal">COLLECTION STATUS</div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Assign Button */}
        <div className="flex-shrink-0 ml-8">
          <button
            className="bg-green-500 hover:bg-green-600 text-green-900 font-semibold px-8 py-2 rounded transition text-base shadow-none focus:outline-none focus:ring-2 focus:ring-green-700"
            onClick={handleAssign}
          >
            Assign
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        {/* Barangay Sidebar - Minimal Design */}
        <div className="bg-white rounded-lg border border-green-200 p-5 w-full lg:w-80 flex flex-col">
          <h2 className="text-lg font-medium text-green-800 mb-4">Barangay Selection</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Barangay"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-green-200 rounded-md text-sm bg-green-50 text-gray-800 outline-none transition-all duration-200 focus:border-green-800"
            />
          </div>
          
          {/* Barangay List */}
          <div className="flex-1 overflow-y-auto rounded border border-green-200 bg-green-50">
            {filteredBarangays.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">No results found</div>
            )}
            {filteredBarangays.map(b => (
              <div
                key={b}
                className={`px-4 py-3 cursor-pointer flex items-center gap-2 transition-all duration-200 border-b border-green-100 last:border-b-0 ${
                  selected === b 
                    ? 'bg-green-800 text-white' 
                    : 'hover:bg-green-100 text-gray-700'
                }`}
                onClick={() => setSelected(b)}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${
                  selected === b ? 'bg-white' : 'bg-green-600'
                }`}></span>
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section - Minimal Design */}
        <div className="flex-1 bg-white rounded-lg border border-green-200 p-5">
          <h2 className="text-lg font-medium text-green-800 mb-4">Location Map</h2>
          <div className="w-full h-[400px] rounded-lg border border-green-200 overflow-hidden">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <MapUpdater position={center} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={center}>
                <Popup className="text-sm">
                  <div className="text-center">
                    <div className="font-medium text-green-800">{selected}</div>
                    <div className="text-xs text-gray-600">Selected Barangay</div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
          <style>{`
            .leaflet-pane, .leaflet-top, .leaflet-bottom {
              z-index: 10 !important;
            }
          `}</style>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-green-700"
              onClick={() => setShowAssignModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-semibold text-green-800 mb-4">Assign Task to {selected}</h2>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {/* Truck Driver */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Truck Driver</label>
                <select
                  name="truckDriver"
                  value={assignForm.truckDriver}
                  onChange={handleAssignFormChange}
                  required
                  className="w-full border border-green-200 rounded px-3 py-2 text-sm"
                  disabled={loadingDrivers}
                >
                  <option value="">{loadingDrivers ? 'Loading...' : 'Select Truck Driver'}</option>
                  {truckDrivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              {/* Garbage Collectors */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Garbage Collectors</label>
                <div className="flex flex-wrap gap-2">
                  {loadingCollectors ? (
                    <span className="text-gray-500 text-sm">Loading...</span>
                  ) : (
                    garbageCollectors.map((gc) => (
                      <label key={gc.id} className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          name="garbageCollectors"
                          value={gc.id}
                          checked={assignForm.garbageCollectors.includes(gc.id)}
                          onChange={handleAssignFormChange}
                          className="accent-green-600"
                        />
                        {gc.name}
                      </label>
                    ))
                  )}
                </div>
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={assignForm.date}
                  onChange={handleAssignFormChange}
                  required
                  className="w-full border border-green-200 rounded px-3 py-2 text-sm"
                />
              </div>
              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={assignForm.time}
                  onChange={handleAssignFormChange}
                  required
                  className="w-full border border-green-200 rounded px-3 py-2 text-sm"
                />
              </div>
              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Task Type</label>
                <select
                  name="taskType"
                  value={assignForm.taskType}
                  onChange={handleAssignFormChange}
                  className="w-full border border-green-200 rounded px-3 py-2 text-sm"
                >
                  <option value="regular">Regular</option>
                  <option value="special">Special</option>
                </select>
              </div>
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={assignForm.notes}
                  onChange={handleAssignFormChange}
                  className="w-full border border-green-200 rounded px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                disabled={assignLoading}
              >
                {assignLoading ? 'Assigning...' : 'Assign Task'}
              </button>
              {assignSuccess && <div className="text-green-700 text-sm mt-2">{assignSuccess}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}