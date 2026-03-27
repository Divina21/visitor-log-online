"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';

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
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', purpose: '', host: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Fetch visitor logs from Contentful via API
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching visitor logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * HANDLERS
   */
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setCheckInLoading(true);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check-in failed');
      const newEntry = data;
      setLogs([newEntry, ...logs]);
      setFormData({ fullName: '', phoneNumber: '', purpose: '', host: '' });
      triggerSuccess('in');
    } catch (err) {
      console.error('Check-in error:', err);
      alert('Check-in failed: ' + err.message);
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const res = await fetch(`/api/visitors/${id}`, { method: 'PATCH' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('Check-out failed:', body);
        throw new Error(body.error || 'Check-out failed');
      }
      const updated = await res.json();
      setLogs(logs.map(log => log.id === id ? updated : log));
      triggerSuccess('out');
    } catch (err) {
      console.error('Check-out error:', err);
    }
  };

  const handleEditVisitor = async (id, formData) => {
    const res = await fetch(`/api/visitors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    setLogs(logs.map(log => log.id === id ? data : log));
  };

  const handleDeleteVisitor = async (id) => {
    const res = await fetch(`/api/visitors/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    setLogs(logs.filter(log => log.id !== id));
  };

  const triggerSuccess = (type) => {
    setSuccessType(type);
    setView('success');
    setTimeout(() => {
      setView('home');
      setSuccessType(null);
    }, 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        setView('dashboard');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Login failed. Please try again.');
    }
  };

  /**
   * COMPUTED VALUES
   */
  const filteredActive = useMemo(() => {
    return logs.filter(l => 
      l.status === 'active' && 
      (l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || String(l.phoneNumber).includes(searchQuery))
    );
  }, [logs, searchQuery]);

  const stats = useMemo(() => ({
    currentlyIn: logs.filter(l => l.status === 'active').length,
    totalToday: logs.length,
    lastHour: logs.filter(l => new Date(l.checkInTime) > new Date(Date.now() - 3600000)).length
  }), [logs]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <CustomStyles />
      <Navbar isLoggedIn={isLoggedIn} setView={setView} setIsLoggedIn={setIsLoggedIn} />

      <main className="container py-5 flex-grow-1">
        {view === 'home' && <HomeView setView={setView} stats={stats} />}
        {view === 'checkin' && <CheckInView setView={setView} formData={formData} setFormData={setFormData} onSubmit={handleCheckIn} loading={checkInLoading} />}
        {view === 'checkout' && <CheckOutView setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredActive={filteredActive} onCheckOut={handleCheckOut} />}
        {view === 'login' && <LoginView setView={setView} loginData={loginData} setLoginData={setLoginData} onSubmit={handleLogin} loginError={loginError} />}
        {view === 'dashboard' && <DashboardView stats={stats} logs={logs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onEditVisitor={handleEditVisitor} onDeleteVisitor={handleDeleteVisitor} />}
      </main>

      {view === 'success' && <SuccessOverlay successType={successType} />}
      <Footer />
    </div>
  );
}