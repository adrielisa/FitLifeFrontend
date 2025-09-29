import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login-Register/Login";
import Register from "./pages/Login-Register/Register";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LadingPage";

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Login - Pantalla completa sin header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LandingPage />} />

        {/* Otras rutas con header y layout */}
      </Routes>
    </Router>
  );
}

export default App;