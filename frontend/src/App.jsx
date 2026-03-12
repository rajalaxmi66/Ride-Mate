import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import CreateRide from "./pages/CreateRide";
import MatchRide from "./pages/MatchRide";
import GroupDetails from "./pages/GroupDetails";
import ProtectedRoute from "./auth/ProtectedRoute";
import RideCompleted from "./pages/RideCompleted";
import Navbar from "./components/Navbar";

// <-- Import MapLoader
import MapLoader from "./MapLoader";

function App() {
  return (
    <BrowserRouter>
      <MapLoader /> {/* Dynamically loads Google Maps script */}
      <Navbar />
      <Routes>
        {/* Public Home */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/ride/create"
          element={
            <ProtectedRoute>
              <CreateRide />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ride/match/:id"
          element={
            <ProtectedRoute>
              <MatchRide />
            </ProtectedRoute>
          }
        />

        <Route
          path="/group/:id"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ride/completed/:id"
          element={
            <ProtectedRoute>
              <RideCompleted />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;