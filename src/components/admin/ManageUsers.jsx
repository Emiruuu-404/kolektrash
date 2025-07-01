import React, { useState } from "react";
import { FiSearch, FiPlus, FiUser, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

// Environmental theme colors - Tree-inspired palette (same as ManageRoute)
const ENV_COLORS = {
  primary: '#2d5016',      // Deep forest green (tree trunk)
  secondary: '#4a7c59',    // Sage green (mature leaves)
  accent: '#8fbc8f',       // Light sage (new leaves)
  light: '#f8faf5',        // Very light mint (forest mist)
  white: '#ffffff',        // Pure white
  text: '#2c3e50',         // Dark bark
  textLight: '#7f8c8d',    // Light bark
  success: '#27ae60',      // Emerald green (healthy leaves)
  warning: '#f39c12',      // Autumn orange (falling leaves)
  error: '#e74c3c',        // Red (diseased leaves)
  border: '#e8f5e8',       // Light green border (forest floor)
  shadow: 'rgba(45, 80, 22, 0.08)', // Tree-tinted shadow
  bark: '#5d4e37',         // Tree bark brown
  moss: '#9caa7b',         // Moss green
  leaf: '#6b8e23',         // Olive green (leaves)
  soil: '#8b4513'          // Rich soil brown
};

const accountTypes = ["All", "Truck Driver", "Garbage Collector", "Barangay Head", "Resident"];
const statuses = ["All", "On Duty", "Off Duty", "On Leave", "Completed Route"];
const clusters = ["All", "Cluster A", "Cluster B", "Cluster C"];

// Color map for roles using tree palette
const roleColors = {
  "Truck Driver": "bg-green-800 text-white",
  "Garbage Collector": "bg-green-600 text-white",
  "Barangay Head": "bg-amber-800 text-white",
  "Resident": "bg-green-300 text-gray-800",
};

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@waste.com",
    role: "Truck Driver",
    status: "On Duty",
    team: "Cluster A",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@waste.com",
    role: "Garbage Collector",
    status: "Completed Route",
    team: "Cluster B",
  },
  {
    id: 3,
    name: "Carlos Reyes",
    email: "carlos@waste.com",
    role: "Barangay Head",
    status: "On Leave",
    team: "Cluster C",
  },
  {
    id: 4,
    name: "Maria Lopez",
    email: "maria@waste.com",
    role: "Resident",
    status: "Off Duty",
    team: "Cluster A",
  },
  {
    id: 5,
    name: "Alex Tan",
    email: "alex@waste.com",
    role: "Truck Driver",
    status: "Completed Route",
    team: "Cluster B",
  },
  {
    id: 6,
    name: "Liza Cruz",
    email: "liza@waste.com",
    role: "Garbage Collector",
    status: "On Duty",
    team: "Cluster C",
  },
  {
    id: 7,
    name: "Ramon Santos",
    email: "ramon@waste.com",
    role: "Barangay Head",
    status: "On Duty",
    team: "Cluster A",
  },
  {
    id: 8,
    name: "Ella Lim",
    email: "ella@waste.com",
    role: "Resident",
    status: "On Leave",
    team: "Cluster B",
  },
  {
    id: 9,
    name: "Ben Cruz",
    email: "ben@waste.com",
    role: "Truck Driver",
    status: "Off Duty",
    team: "Cluster C",
  },
  {
    id: 10,
    name: "Grace Yu",
    email: "grace@waste.com",
    role: "Garbage Collector",
    status: "On Duty",
    team: "Cluster A",
  },
];

const tasks = [
  {
    id: 1,
    userId: 1,
    date: "May 17, 2025",
    time: "09:00 - 12:00",
    location: "Sagrada Familia",
    status: "Completed",
    title: "Morning Collection",
  },
  {
    id: 2,
    userId: 1,
    date: "May 17, 2025",
    time: "14:00 - 17:00",
    location: "Aldezar",
    status: "In Progress",
    title: "Afternoon Collection",
  },
  {
    id: 3,
    userId: 2,
    date: "May 18, 2025",
    time: "10:00 - 13:00",
    location: "Bulan",
    status: "Not Done",
    title: "Special Pickup",
  },
  {
    id: 4,
    userId: 3,
    date: "May 19, 2025",
    time: "08:00 - 10:00",
    location: "Biglaan",
    status: "Completed",
    title: "Barangay Meeting",
  },
  {
    id: 5,
    userId: 4,
    date: "May 20, 2025",
    time: "11:00 - 12:00",
    location: "Salvacion",
    status: "In Progress",
    title: "Resident Feedback",
  },
  {
    id: 6,
    userId: 5,
    date: "May 21, 2025",
    time: "13:00 - 15:00",
    location: "Tula-Tula",
    status: "Completed",
    title: "Route Completion",
  },
  {
    id: 7,
    userId: 6,
    date: "May 22, 2025",
    time: "09:00 - 11:00",
    location: "Aldezar",
    status: "Not Done",
    title: "Missed Collection",
  },
  {
    id: 8,
    userId: 7,
    date: "May 23, 2025",
    time: "10:00 - 12:00",
    location: "Bulan",
    status: "Completed",
    title: "Barangay Inspection",
  },
  {
    id: 9,
    userId: 8,
    date: "May 24, 2025",
    time: "15:00 - 17:00",
    location: "Sagrada Familia",
    status: "In Progress",
    title: "Resident Meeting",
  },
  {
    id: 10,
    userId: 9,
    date: "May 25, 2025",
    time: "08:00 - 10:00",
    location: "Biglaan",
    status: "Completed",
    title: "Morning Route",
  },
  {
    id: 11,
    userId: 10,
    date: "May 26, 2025",
    time: "10:00 - 12:00",
    location: "Salvacion",
    status: "Not Done",
    title: "Missed Pickup",
  },
];

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState("All");
  const [status, setStatus] = useState("All");
  const [cluster, setCluster] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = accountType === "All" || u.role === accountType;
    const matchesStatus = status === "All" || u.status === status;
    const matchesCluster = cluster === "All" || u.team === cluster;
    return matchesSearch && matchesType && matchesStatus && matchesCluster;
  });

  // Stats
  const userTasks = selectedUser
    ? tasks.filter((t) => t.userId === selectedUser.id)
    : [];
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = userTasks.filter((t) => t.status !== "Completed").length;

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "On Duty":
        return { bg: ENV_COLORS.light, color: ENV_COLORS.success };
      case "Completed Route":
        return { bg: ENV_COLORS.light, color: ENV_COLORS.primary };
      case "On Leave":
        return { bg: '#fff3cd', color: ENV_COLORS.warning };
      case "Off Duty":
        return { bg: '#f8d7da', color: ENV_COLORS.error };
      default:
        return { bg: ENV_COLORS.light, color: ENV_COLORS.textLight };
    }
  };

  // Function to get task status color
  const getTaskStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return { bg: ENV_COLORS.light, color: ENV_COLORS.success };
      case "In Progress":
        return { bg: '#fff3cd', color: ENV_COLORS.warning };
      case "Not Done":
        return { bg: '#f8d7da', color: ENV_COLORS.error };
      default:
        return { bg: ENV_COLORS.light, color: ENV_COLORS.textLight };
    }
  };

  return (
    <div className="p-6 max-w-full overflow-x-auto bg-green-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-green-800 mb-2 font-normal tracking-tight">
          User Management
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 m-0 font-normal">
          Manage team members and track performance
        </p>
      </div>

      {/* Action Buttons - Minimal Design */}
      <div className="flex gap-3 my-6 flex-wrap justify-start">
        <button className="px-5 py-2.5 bg-green-800 text-white border-none rounded-lg font-medium cursor-pointer text-sm min-w-fit transition-all duration-200 flex items-center gap-2 hover:bg-green-600">
          <FiPlus className="text-base" />
          Create Account
        </button>
      </div>

      {/* Filters - Minimal Design */}
      <div className="flex gap-3 mb-6 items-center flex-wrap justify-center p-4 bg-white rounded-lg border border-green-200">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-200 text-sm bg-green-50 text-gray-800 outline-none transition-all duration-200 focus:border-green-800"
          />
        </div>
        <select 
          value={cluster} 
          onChange={(e) => setCluster(e.target.value)} 
          className="px-3 py-2 rounded-md border border-green-200 text-sm min-w-fit bg-green-50 text-gray-800 outline-none cursor-pointer transition-all duration-200 focus:border-green-800"
        >
          {clusters.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select 
          value={accountType} 
          onChange={(e) => setAccountType(e.target.value)} 
          className="px-3 py-2 rounded-md border border-green-200 text-sm min-w-fit bg-green-50 text-gray-800 outline-none cursor-pointer transition-all duration-200 focus:border-green-800"
        >
          {accountTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="px-3 py-2 rounded-md border border-green-200 text-sm min-w-fit bg-green-50 text-gray-800 outline-none cursor-pointer transition-all duration-200 focus:border-green-800"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards - Minimal Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-5 rounded-lg border border-green-200 text-center">
          <div className="text-sm text-gray-600 mb-2">Total Users</div>
          <div className="text-2xl font-normal text-green-800">{filteredUsers.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-200 text-center">
          <div className="text-sm text-gray-600 mb-2">On Duty</div>
          <div className="text-2xl font-normal text-green-600">
            {filteredUsers.filter(u => u.status === "On Duty").length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-200 text-center">
          <div className="text-sm text-gray-600 mb-2">On Leave</div>
          <div className="text-2xl font-normal text-orange-500">
            {filteredUsers.filter(u => u.status === "On Leave").length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-green-200 text-center">
          <div className="text-sm text-gray-600 mb-2">Off Duty</div>
          <div className="text-2xl font-normal text-red-500">
            {filteredUsers.filter(u => u.status === "Off Duty").length}
          </div>
        </div>
      </div>

      {/* Main Content: User Cards + Sidebar */}
      <div className="flex gap-5 flex-col lg:flex-row">
        {/* User Cards */}
        <div className="flex-2 min-w-0">
          <div className="bg-white rounded-lg border border-green-200 p-5">
            <h2 className="text-lg mb-4 text-green-800 font-medium">
              Team Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 text-center ${
                    selectedUser && selectedUser.id === user.id 
                      ? 'bg-green-50 border-green-800' 
                      : 'border-green-200 hover:bg-green-50'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3 ${
                    roleColors[user.role] || 'bg-gray-400 text-white'
                  }`}>
                    <FiUser />
                  </div>
                  <div className="font-medium text-sm text-gray-800 mb-1">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {user.email}
                  </div>
                  <div className="text-sm text-gray-800 mb-2">
                    {user.role}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {user.team}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === "On Duty"
                      ? "bg-green-100 text-green-700"
                      : user.status === "Completed Route"
                      ? "bg-green-100 text-green-800"
                      : user.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex-1 min-w-0 lg:min-w-[300px]">
          <div className="bg-white rounded-lg border border-green-200 p-5 h-fit">
            <h2 className="text-lg mb-4 text-green-800 font-medium">
              User Tasks
            </h2>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 rounded-md">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${
                    roleColors[selectedUser.role] || 'bg-gray-400 text-white'
                  }`}>
                    <FiUser />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {selectedUser.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedUser.role} / {selectedUser.team}
                    </div>
                  </div>
                </div>
                
                {/* Task Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total</div>
                    <div className="text-xl font-normal text-green-800">{totalTasks}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Completed</div>
                    <div className="text-xl font-normal text-green-600">{completedTasks}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Pending</div>
                    <div className="text-xl font-normal text-orange-500">{pendingTasks}</div>
                  </div>
                </div>

                {/* Task List */}
                <div className="flex flex-col gap-2">
                  {userTasks.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-5">
                      No tasks assigned.
                    </div>
                  )}
                  {userTasks.map((task) => (
                    <div key={task.id} className="bg-green-50 rounded-md p-3 border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm text-gray-800">
                          {task.title}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-0.5">
                        {task.date} • {task.time}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.location}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm text-center py-10">
                Select a user to view their tasks.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
