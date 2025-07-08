import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const ENV_COLORS = {
  primary: '#2d5016',
  secondary: '#4a7c59',
  accent: '#8fbc8f',
  light: '#f8faf5',
  white: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  border: '#e8f5e8',
  shadow: 'rgba(45, 80, 22, 0.08)',
  bark: '#5d4e37',
  moss: '#9caa7b',
  leaf: '#6b8e23',
  soil: '#8b4513'
}

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Collections',
      data: [12, 18, 3, 4, 2, 4, 9],
      backgroundColor: ENV_COLORS.primary,
      borderColor: ENV_COLORS.secondary,
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}

const pieData = {
  labels: ['Completed', 'In Progress', 'Delayed'],
  datasets: [
    {
      data: [70, 15, 15],
      backgroundColor: [ENV_COLORS.primary, ENV_COLORS.secondary, ENV_COLORS.accent],
      borderColor: ENV_COLORS.white,
      borderWidth: 2,
      hoverBorderColor: ENV_COLORS.light,
      hoverBorderWidth: 3,
    },
  ],
}

export default function Dashboard() {
  return (
    <div className="p-6 max-w-full overflow-x-auto bg-green-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-green-800 mb-2 font-normal tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 m-0 font-normal">
          Track collection progress, view logs, and monitor waste management activities
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <div className="bg-white p-6 rounded-lg border border-green-200 text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-sm text-gray-600 mb-2">Total Collections</div>
          <div className="text-3xl font-normal text-green-800">100</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-green-200 text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-sm text-gray-600 mb-2">Completed Today</div>
          <div className="text-3xl font-normal text-green-800">20</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-green-200 text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-sm text-gray-600 mb-2">Delayed Collections</div>
          <div className="text-3xl font-normal text-red-500">12</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <div className="bg-white rounded-lg border border-green-200 p-5 h-96">
          <h2 className="text-lg mb-4 text-green-800 font-medium">Weekly Collection Stats</h2>
          <div className="h-80">
            <Bar data={barData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#ffffff',
                  titleColor: '#2c3e50',
                  bodyColor: '#2c3e50',
                  borderColor: '#e8f5e8',
                  borderWidth: 1,
                  cornerRadius: 6,
                  displayColors: false,
                  titleFont: { size: 13, weight: '500' },
                  bodyFont: { size: 12 }
                }
              },
              scales: { 
                y: { 
                  beginAtZero: true, 
                  ticks: { 
                    stepSize: 4,
                    color: '#7f8c8d',
                    font: { size: 12 }
                  },
                  grid: {
                    color: '#e8f5e8',
                    lineWidth: 1
                  },
                  border: {
                    color: '#e8f5e8'
                  }
                },
                x: {
                  ticks: {
                    color: '#7f8c8d',
                    font: { size: 12 }
                  },
                  grid: {
                    color: '#e8f5e8',
                    lineWidth: 1
                  },
                  border: {
                    color: '#e8f5e8'
                  }
                }
              },
            }} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-green-200 p-5 h-96">
          <h2 className="text-lg mb-4 text-green-800 font-medium flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 11V7a4 4 0 118 0v4M5 13v-2a4 4 0 118 0v2" />
            </svg>
            Collection Status Distribution
          </h2>
          <div className="h-80">
            <Pie data={pieData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: '#2c3e50',
                    font: { size: 11 },
                    padding: 8,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    generateLabels: (chart) => [
                      { text: 'Completed', fillStyle: '#2d5016' },
                      { text: 'In Progress', fillStyle: '#4a7c59' },
                      { text: 'Delayed', fillStyle: '#8fbc8f' },
                    ],
                  },
                },
                tooltip: {
                  backgroundColor: '#ffffff',
                  titleColor: '#2c3e50',
                  bodyColor: '#2c3e50',
                  borderColor: '#e8f5e8',
                  borderWidth: 1,
                  cornerRadius: 6,
                  displayColors: true,
                  titleFont: { size: 13, weight: '500' },
                  bodyFont: { size: 12 }
                }
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
