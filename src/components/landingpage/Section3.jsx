import React from 'react'

const Section3 = () => {
  return (
    <div
      className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/generative-ai-illustration-eco-light-bulb-surrounded-by-forest-clean-energy-environment_58460-20091.jpg')`, 
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center text-white px-8 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Make a Difference Today</h2>
        <p className="text-lg mb-8 text-gray-100">Join us in transforming waste management for a better tomorrow.</p>
        <button className="bg-white text-gray-800 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium shadow-sm">
          Sign Up Now
        </button>
      </div>
    </div>
  )
}

export default Section3
