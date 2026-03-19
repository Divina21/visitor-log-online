"use client";
import React, { useState, useEffect, useMemo } from 'react';

import { INITIAL_LOGS } from '../lib/mockData';
import CustomStyles from './CustomStyles';
import Navbar from './Navbar';
import HomeView from './HomeView';
import CheckInView from './CheckInView';
import CheckOutView from './CheckOutView';
import LoginView from './LoginView';
import DashboardView from './DashboardView';
import SuccessOverlay from './SuccessOverlay';
import Footer from './Footer';

export default function App() {
  // Navigation & Auth State
  const [view, setView] = useState('home');
  const [successType, setSuccessType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Data State
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form States
  const [formData, setFormData] = useState({ name: '', phone: '', purpose: 'Business Meeting', host: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Inject Bootstrap CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  /**
   * HANDLERS
   */
  const handleCheckIn = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: 'active'
    };
    setLogs([newEntry, ...logs]);
    setFormData({ name: '', phone: '', purpose: 'Business Meeting', host: '' });
    triggerSuccess('in');
  };

  const handleCheckOut = (id) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...log, checkOut: new Date().toISOString(), status: 'completed' } : log
    ));
    triggerSuccess('out');
  };

  const triggerSuccess = (type) => {
    setSuccessType(type);
    setView('success');
    setTimeout(() => {
      setView('home');
      setSuccessType(null);
    }, 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'password123') {
      setIsLoggedIn(true);
      setView('dashboard');
    } else {
      console.log("Invalid credentials. Try admin / password123");
    }
  };

  /**
   * COMPUTED VALUES
   */
  const filteredActive = useMemo(() => {
    return logs.filter(l => 
      l.status === 'active' && 
      (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.phone.includes(searchQuery))
    );
  }, [logs, searchQuery]);

  const stats = useMemo(() => ({
    currentlyIn: logs.filter(l => l.status === 'active').length,
    totalToday: logs.length,
    lastHour: logs.filter(l => new Date(l.checkIn) > new Date(Date.now() - 3600000)).length
  }), [logs]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <CustomStyles />
      <Navbar isLoggedIn={isLoggedIn} setView={setView} setIsLoggedIn={setIsLoggedIn} />

      <main className="container py-5 flex-grow-1">
        {view === 'home' && <HomeView setView={setView} stats={stats} />}
        {view === 'checkin' && <CheckInView setView={setView} formData={formData} setFormData={setFormData} onSubmit={handleCheckIn} />}
        {view === 'checkout' && <CheckOutView setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredActive={filteredActive} onCheckOut={handleCheckOut} />}
        {view === 'login' && <LoginView setView={setView} loginData={loginData} setLoginData={setLoginData} onSubmit={handleLogin} />}
        {view === 'dashboard' && <DashboardView stats={stats} logs={logs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      </main>

      {view === 'success' && <SuccessOverlay successType={successType} />}
      <Footer />
    </div>
  );
}