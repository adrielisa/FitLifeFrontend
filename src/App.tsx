import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WorkoutSessionProvider } from "./context/WorkoutSessionContext";
import Login from "./pages/Login-Register/Login";
import Register from "./pages/Login-Register/Register";
import Profile from "./pages/Profile/Profile";
import ExercisePlanSelection from "./pages/Exercises/ExercisePlanSelection";
import ExerciseSelection from "./pages/Exercises/ExerciseSelection";
import ExercisesMain from "./pages/Exercises/ExercisesMain";
import Home from "./pages/Home/Home";
import WorkoutPlan from "./pages/Exercises/WorkoutPlan";
import ExerciseDetail from "./pages/Exercises/ExerciseDetails";
import ExerciseInformation from "./pages/Exercises/ExerciseInformation";
import Meals from "./pages/Meals/Meals";
import MealsSelect from "./pages/Meals/MealsSelect";
import ExerciseCardio from "./pages/Exercises/ExerciseCardio";
import MealsHistorial from "./pages/Meals/MealsHistorial";
import LandingPage from "./pages/LandingPage/LadingPage"; 

function App(): React.JSX.Element {
  return (
    <WorkoutSessionProvider>
      <Router>
        <Routes>
          {/* Login - Pantalla completa sin header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercisesPlan" element={<ExercisePlanSelection />} />
          <Route path="/exercise-selection" element={<ExerciseSelection />} />
          <Route path="/exercises" element={<ExercisesMain />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workoutPlan" element={<WorkoutPlan />} />
          <Route path="/exercise-detail" element={<ExerciseDetail />} />
          <Route path="/exerciseInfo" element={<ExerciseInformation />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/meals-select" element={<MealsSelect />} />
          <Route path="/exerciseCardio" element={<ExerciseCardio />} />
          <Route path="/meals-historial" element={<MealsHistorial />} />
          <Route path="/*" element={<LandingPage />} /> 
        </Routes>
      </Router>
    </WorkoutSessionProvider>
  );
}

export default App;