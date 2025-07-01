import React from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar
} from 'react-icons/fi';

const tasks = [
  {
    id: 1,
    title: 'Special Collection: Brgy. Looc',
    description: 'Additional collection requested for festival cleanup',
    priority: 'high',
    status: 'pending',
    dueTime: '10:00 AM',
    location: 'Brgy. Looc Central',
  },
  {
    id: 2,
    title: 'Vehicle Maintenance Check',
    description: 'Regular maintenance inspection before route',
    priority: 'medium',
    status: 'completed',
    dueTime: '7:30 AM',
    location: 'Main Depot',
  },
  {
    id: 3,
    title: 'Route B Coverage',
    description: 'Regular collection schedule for Route B',
    priority: 'normal',
    status: 'in-progress',
    dueTime: '1:00 PM',
    location: 'Multiple Areas',
  }
];

export default function GarbageCollectorTasks() {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'normal':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50';
      case 'in-progress':
        return 'text-blue-700 bg-blue-50';
      case 'pending':
        return 'text-gray-700 bg-gray-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your daily collection tasks</p>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                    <FiAlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    <span>{task.dueTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiMapPin className="w-4 h-4" />
                    <span>{task.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                
                <div className="flex gap-2">
                  {task.status === 'pending' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Start Task
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Update Progress
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
