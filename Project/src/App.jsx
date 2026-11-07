import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AddRoute from './components/AddRoute';
import RouteDetails from './components/RouteDetails';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-route" element={<AddRoute />} />
        <Route path="/route/:id" element={<RouteDetails />} />
      </Routes>
    </BrowserRouter>
  );
}