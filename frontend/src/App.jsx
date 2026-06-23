import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Components/contexts/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import AddTrip from './pages/AddTrip';
import TripDetail from './pages/TripDetail';
import Members from './pages/Members';
import Balances from './pages/Balances';
import Settlements from './pages/Settlements';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/add-trip" element={<AddTrip />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/members" element={<Members />} />
          <Route path="/balances" element={<Balances />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;