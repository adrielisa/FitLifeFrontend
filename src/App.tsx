import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login-Register/Login";
import Register from "./pages/Login-Register/Register";
import Profile from "./pages/Profile/Profile";

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Login - Pantalla completa sin header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Otras rutas con header y layout */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-gray-900">FitLife</h1>
                    <nav className="space-x-4">
                      <Link to="/" className="text-gray-600 hover:text-gray-900">
                        Home
                      </Link>
                      <Link to="/exercises" className="text-gray-600 hover:text-gray-900">
                        Exercises
                      </Link>
                      <Link to="/nutrition" className="text-gray-600 hover:text-gray-900">
                        Nutrition
                      </Link>
                      <Link to="/login" className="text-gray-600 hover:text-gray-900">
                        Login
                      </Link>
                      <Link to="/register" className="text-gray-600 hover:text-gray-900">
                        Register
                      </Link>
                      <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                        Profile
                      </Link>
                    </nav>
                  </div>
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  {/* Home */}
                  <Route
                    path="/"
                    element={
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Welcome to FitLife
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                          Your personal fitness and nutrition companion
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Exercises
                            </h3>
                            <p className="text-gray-600">
                              Track your workouts and progress
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Nutrition
                            </h3>
                            <p className="text-gray-600">
                              Monitor your daily nutrition intake
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Progress
                            </h3>
                            <p className="text-gray-600">
                              See your fitness journey
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  {/* Exercises */}
                  <Route
                    path="/exercises"
                    element={
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Exercises
                        </h2>
                        <p className="text-lg text-gray-600">
                          Your exercise tracking page
                        </p>
                      </div>
                    }
                  />

                  {/* Nutrition */}
                  <Route
                    path="/nutrition"
                    element={
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Nutrition
                        </h2>
                        <p className="text-lg text-gray-600">
                          Your nutrition tracking page
                        </p>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;