import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Components/contexts/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import AddTrip from './pages/Add/AddTrip';
import AddExpense from './pages/Add/AddExpense';
import EditExpense from './pages/EditExpense';
import TripDetail from './pages/TripDetail';
import Members from './pages/Members';
import TripMembers from './pages/TripMembers';
import Balances from './pages/Balances';
import TripBalances from './pages/TripBalances';
import Settlements from './pages/Settlements';
import TripSettlements from './pages/TripSettlements';
import Invitations from './pages/Invitations';
import Profile from './pages/Profile';
import Expenses from './pages/Expenses';

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
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/add-trip" element={<AddTrip />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/trip/:tripId/add-expense" element={<AddExpense />} />
          <Route path="/trip/:tripId/edit-expense/:expenseId" element={<EditExpense />} />
          <Route path="/members" element={<Members />} />
          <Route path="/trip/:tripId/members" element={<TripMembers />} />
          <Route path="/balances" element={<Balances />} />
          <Route path="/trip/:tripId/balances" element={<TripBalances />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/trip/:tripId/settlements" element={<TripSettlements />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;