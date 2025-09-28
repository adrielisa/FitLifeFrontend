import React from 'react'

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">FitLife</h1>
            <nav className="space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Exercises</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Nutrition</a>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to FitLife
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your personal fitness and nutrition companion
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exercises</h3>
              <p className="text-gray-600">Track your workouts and progress</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nutrition</h3>
              <p className="text-gray-600">Monitor your daily nutrition intake</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress</h3>
              <p className="text-gray-600">See your fitness journey</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App