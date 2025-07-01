import React, { useState } from 'react';
import { FiDownload, FiPlay, FiBookOpen, FiCheckCircle, FiSearch, FiChevronRight } from 'react-icons/fi';

const categories = [
  { id: 'segregation', label: 'Waste Segregation', icon: '🗑️' },
  { id: 'recycling', label: 'Recycling Guide', icon: '♻️' },
  { id: 'composting', label: 'Composting Tips', icon: '🌱' },
  { id: 'hazardous', label: 'Hazardous Waste', icon: '⚠️' },
  { id: 'schedule', label: 'Collection Schedule', icon: '📅' },
];

const materials = {
  segregation: [
    {
      title: 'Proper Waste Segregation Guide',
      type: 'pdf',
      size: '2.5 MB',
      description: 'Learn how to properly segregate your household waste',
    },
    {
      title: 'Biodegradable vs Non-biodegradable',
      type: 'video',
      duration: '5:30',
      description: 'Understanding different types of waste',
    },
  ],
  recycling: [
    {
      title: 'Recyclable Materials Chart',
      type: 'pdf',
      size: '1.8 MB',
      description: 'Complete chart of recyclable materials',
    },
    {
      title: 'Home Recycling Tips',
      type: 'pdf',
      size: '1.2 MB',
      description: 'Easy ways to recycle at home',
    },
  ],
  composting: [
    {
      title: 'Backyard Composting Guide',
      type: 'pdf',
      size: '3.1 MB',
      description: 'Start your own compost pile',
    },
    {
      title: 'Vermicomposting Tutorial',
      type: 'video',
      duration: '8:45',
      description: 'Learn vermicomposting techniques',
    },
  ],
  hazardous: [
    {
      title: 'Hazardous Waste Handling',
      type: 'pdf',
      size: '2.2 MB',
      description: 'Safety guidelines for hazardous materials',
    },
    {
      title: 'Chemical Waste Disposal',
      type: 'pdf',
      size: '1.5 MB',
      description: 'Proper disposal of chemical waste',
    },
  ],
  schedule: [
    {
      title: 'Collection Schedule 2025',
      type: 'pdf',
      size: '1.0 MB',
      description: 'Complete collection schedule for 2025',
    },
    {
      title: 'Holiday Collection Notice',
      type: 'pdf',
      size: '0.5 MB',
      description: 'Special schedule for holidays',
    },
  ],
};

export default function IEC() {
  const [selectedCategory, setSelectedCategory] = useState('segregation');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all materials across categories
  const getAllMaterials = () => {
    const allMaterials = [];
    Object.entries(materials).forEach(([category, items]) => {
      items.forEach(item => {
        allMaterials.push({
          ...item,
          category // Add category information to each item
        });
      });
    });
    return allMaterials;
  };

  // Filter materials by search
  const filteredMaterials = searchQuery
    ? getAllMaterials().filter((material) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : materials[selectedCategory];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">IEC Materials for Barangay Officials</h1>
          <p className="text-gray-600">Access and share educational materials about proper waste management and environmental care for your barangay.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search educational materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Featured: Waste Segregation 101</h2>
              <p className="mb-4 text-green-100">Learn the basics of proper waste segregation and help create a cleaner barangay.</p>
              <button className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-50 transition-colors">
                <FiPlay className="w-5 h-5" />
                Watch Video
              </button>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-green-800 rounded-lg flex items-center justify-center">
              <FiPlay className="w-12 h-12 text-white opacity-50" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">
                {category.label}
              </span>
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">No materials found.</div>
          ) : (
            filteredMaterials.map((material, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100 text-green-700">
                    {material.type === 'pdf' ? (
                      <FiBookOpen className="w-6 h-6" />
                    ) : (
                      <FiPlay className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {material.type === 'pdf' ? `PDF • ${material.size}` : `Video • ${material.duration}`}
                      </span>
                      {searchQuery && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          {categories.find(cat => cat.id === material.category)?.label || material.category}
                        </span>
                      )}
                      <button className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-medium flex items-center gap-1.5 hover:bg-green-200 transition-colors duration-150 group">
                        {material.type === 'pdf' ? (
                          <>
                            <FiDownload className="w-4 h-4" />
                            Download
                          </>
                        ) : (
                          <>
                            <FiPlay className="w-4 h-4" />
                            Watch
                          </>
                        )}
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Tips</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
              <div className="flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-700">Segregate waste into biodegradable, non-biodegradable, and recyclable categories</p>
            </div>
            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
              <div className="flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-700">Clean and dry recyclable materials before disposal</p>
            </div>
            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
              <div className="flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-700">Use separate containers for different types of waste</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
