"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  UserMinus, 
  LayoutDashboard, 
  LogOut, 
  Users, 
  Search, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Building2,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Phone,
  User,
  MoreVertical,
  Download,
  X
} from 'lucide-react';

/**
 * MOCK DATA INITIALIZATION
 */
const INITIAL_LOGS = [
  { id: '1', name: 'Sarah Jenkins', phone: '555-0101', purpose: 'Business Meeting', host: 'Mark Thompson', checkIn: new Date(Date.now() - 3600000).toISOString(), checkOut: null, status: 'active' },
  { id: '2', name: 'Robert Chen', phone: '555-0122', purpose: 'Maintenance', host: 'Facility Manager', checkIn: new Date(Date.now() - 7200000).toISOString(), checkOut: new Date(Date.now() - 5400000).toISOString(), status: 'completed' },
  { id: '3', name: 'Elena Rodriguez', phone: '555-0199', purpose: 'Job Interview', host: 'HR Department', checkIn: new Date(Date.now() - 1500000).toISOString(), checkOut: null, status: 'active' },
  { id: '4', name: 'Divina De Jesus', phone: '555-0199', purpose: 'Job Interview', host: 'HR Department', checkIn: new Date(Date.now() - 1500000).toISOString(), checkOut: null, status: 'active' },
];

export default function App() {
  // Navigation & Auth State
  const [view, setView] = useState('home'); // home, checkin, checkout, login, dashboard, success
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
    // link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
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
      // In a real app we'd show a UI message, but for this demo:
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

  /**
   * CUSTOM CSS
   */
  const customStyles = (
    <style>{`
      body { background-color: #f8f9fa; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .kiosk-card {
        border-radius: 2rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        cursor: pointer;
      }
      .kiosk-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
        border-color: #0d6efd;
      }
      .btn-rounded { border-radius: 1rem; }
      .form-control-lg { border-radius: 1rem; }
      .success-overlay {
        position: fixed;
        inset: 0;
        background: white;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .progress-bar-custom {
        height: 6px;
        background: #e9ecef;
        border-radius: 10px;
        width: 100%;
        max-width: 300px;
        overflow: hidden;
        margin-top: 2rem;
      }
      .progress-inner {
        height: 100%;
        background: #212529;
        width: 0%;
        animation: progress 3.5s linear forwards;
      }
      @keyframes progress { from { width: 0%; } to { width: 100%; } }
      .active-pulse {
        width: 10px;
        height: 10px;
        background: #0d6efd;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      .animate-in {
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      {customStyles}
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
        <div className="container">
          <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setView('home')}>
            <div className="bg-primary p-2 rounded-3 text-white shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="h5 fw-bold mb-0 text-dark">FrontDesk</h1>
              <small className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Visitor Management</small>
            </div>
          </div>
          
          <div className="ms-auto d-flex align-items-center gap-3">
            {isLoggedIn ? (
              <>
                <button onClick={() => setView('dashboard')} className="btn btn-link text-decoration-none fw-bold text-secondary p-0 me-2">Dashboard</button>
                <button 
                  onClick={() => { setIsLoggedIn(false); setView('home'); }}
                  className="btn btn-light rounded-circle p-2 text-danger border"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setView('login')}
                className="btn btn-link text-decoration-none text-muted fw-bold d-flex align-items-center gap-2"
              >
                <ShieldCheck size={18} /> Staff Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container py-5 flex-grow-1">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="text-center py-5 animate-in">
            <div className="mb-5">
              <h2 className="display-4 fw-bold text-dark mb-3">Welcome.</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Please use the tablet to register your visit or check out before leaving.
              </p>
            </div>
            
            <div className="row g-4 justify-content-center">
              <div className="col-md-5">
                <div onClick={() => setView('checkin')} className="card h-100 kiosk-card shadow-sm p-4 border-0">
                  <div className="card-body d-flex flex-column align-items-center gap-4">
                    <div className="bg-primary bg-opacity-10 text-primary p-4 rounded-4">
                      <UserPlus size={48} />
                    </div>
                    <div>
                      <h3 className="fw-bold h2 mb-1">Log In</h3>
                      <p className="text-muted mb-0">Register as a new visitor</p>
                    </div>
                    <div className="mt-auto fw-bold text-primary d-flex align-items-center gap-2">
                      Start Registration <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div onClick={() => setView('checkout')} className="card h-100 kiosk-card shadow-sm p-4 border-0">
                  <div className="card-body d-flex flex-column align-items-center gap-4">
                    <div className="bg-dark bg-opacity-10 text-dark p-4 rounded-4">
                      <UserMinus size={48} />
                    </div>
                    <div>
                      <h3 className="fw-bold h2 mb-1">Log Out</h3>
                      <p className="text-muted mb-0">I am finishing my visit</p>
                    </div>
                    <div className="mt-auto fw-bold text-muted d-flex align-items-center gap-2">
                      Goodbye <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mt-5 pt-5 justify-content-center border-top">
              <div className="col-auto px-4 text-center">
                <span className="d-block display-6 fw-bold text-dark">{stats.currentlyIn}</span>
                <small className="text-uppercase fw-bold text-muted tracking-widest" style={{fontSize: '10px'}}>Visitors In</small>
              </div>
              <div className="col-auto border-start d-none d-md-block"></div>
              <div className="col-auto px-4 text-center">
                <span className="d-block display-6 fw-bold text-dark">{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <small className="text-uppercase fw-bold text-muted tracking-widest" style={{fontSize: '10px'}}>Today</small>
              </div>
              <div className="col-auto border-start d-none d-md-block"></div>
              <div className="col-auto px-4 text-center">
                <span className="d-block display-6 fw-bold text-dark">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <small className="text-uppercase fw-bold text-muted tracking-widest" style={{fontSize: '10px'}}>Time</small>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CHECK-IN */}
        {view === 'checkin' && (
          <div className="mx-auto animate-in" style={{ maxWidth: '800px' }}>
            <button onClick={() => setView('home')} className="btn btn-link text-decoration-none text-secondary fw-bold mb-4 p-0 d-inline-flex align-items-center gap-1">
              <ChevronLeft size={20} /> Back to Reception
            </button>
            <div className="mb-4">
              <h2 className="fw-bold text-primary">Visitor Check-In</h2>
              <p className="text-muted">Please fill in your details to register.</p>
            </div>
            
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
              <form onSubmit={handleCheckIn} className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><User size={20} className="text-muted" /></span>
                    <input required type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Phone size={20} className="text-muted" /></span>
                    <input required type="tel" className="form-control form-control-lg bg-light border-0" placeholder="e.g. 555-0123" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Purpose of Visit</label>
                  <select className="form-select form-select-lg bg-light border-0" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                    <option>Business Meeting</option>
                    <option>Delivery / Courier</option>
                    <option>Interview</option>
                    <option>Facility Maintenance</option>
                    <option>Personal Visit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Visiting Host</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Users size={20} className="text-muted" /></span>
                    <input required type="text" className="form-control form-control-lg bg-light border-0" placeholder="Who are you meeting?" value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} />
                  </div>
                </div>
                <div className="col-12 pt-4">
                  <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-4 shadow-sm d-inline-flex align-items-center justify-content-center gap-2">
                    Complete Registration <CheckCircle2 size={20} />
                  </button>
                  <p className="text-center text-muted small mt-4">By checking in, you agree to our building's safety and privacy policies.</p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: CHECK-OUT */}
        {view === 'checkout' && (
          <div className="mx-auto animate-in" style={{ maxWidth: '900px' }}>
            <button onClick={() => setView('home')} className="btn btn-link text-decoration-none text-secondary fw-bold mb-4 p-0 d-inline-flex align-items-center gap-1">
              <ChevronLeft size={20} /> Back to Reception
            </button>
            <div className="mb-4">
              <h2 className="fw-bold text-primary">Visitor Check Out</h2>
              <p className="text-muted">Locate your name to signal your departure.</p>
            </div>

            <div className="input-group mb-5 shadow-sm rounded-4 overflow-hidden border">
              <span className="input-group-text bg-white border-0 ps-4"><Search className="text-muted" /></span>
              <input 
                type="text" 
                placeholder="Start typing your name..." 
                className="form-control form-control-lg border-0 py-4 shadow-none" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn btn-white border-0 pe-4" onClick={() => setSearchQuery('')}><X size={20} className="text-muted" /></button>
              )}
            </div>

            <div className="row g-3">
              {filteredActive.length > 0 ? (
                filteredActive.map(visitor => (
                  <div key={visitor.id} className="col-md-6 animate-in">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-2 bg-white">
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 text-primary fw-bold rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            {visitor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h5 className="mb-0 fw-bold">{visitor.name}</h5>
                            <small className="text-muted d-flex align-items-center gap-1">
                              <Clock size={12} className="text-primary" /> Arrived {new Date(visitor.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                          </div>
                        </div>
                        <button onClick={() => handleCheckOut(visitor.id)} className="btn btn-light fw-bold text-dark px-3 rounded-3 border">Check Out</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5 bg-white rounded-4 border border-dashed border-2">
                  <Users className="text-muted mb-3" size={48} opacity={0.3} />
                  <h5 className="fw-bold">No active visitors found</h5>
                  <p className="text-muted mb-0">{searchQuery ? `No matches for "${searchQuery}"` : "Everyone has checked out."}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: LOGIN */}
        {view === 'login' && (
          <div className="mx-auto pt-5 animate-in" style={{ maxWidth: '400px' }}>
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white">
              <div className="card-body text-center">
                <div className="bg-dark text-white p-3 rounded-4 d-inline-block mb-4 shadow">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="fw-bold">Admin Login</h3>
                <p className="text-muted mb-4 small">Authorized personnel only</p>
                
                <form onSubmit={handleLogin} className="text-start">
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Username</label>
                    <input required type="text" className="form-control form-control-lg bg-light border-0" placeholder="admin" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small">Password</label>
                    <input required type="password" className="form-control form-control-lg bg-light border-0" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-dark w-100 py-3 fw-bold rounded-4 shadow mb-3">Sign In</button>
                  <button type="button" onClick={() => setView('home')} className="btn btn-link w-100 text-decoration-none text-muted small">Back to Kiosk</button>
                </form>
                <div className="mt-4 p-3 bg-light rounded-3 text-start">
                   <small className="text-muted d-block">Demo Credentials:</small>
                   <code className="small">admin / password123</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="animate-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="active-pulse"></span>
                  <small className="text-uppercase fw-bold text-muted tracking-widest" style={{ fontSize: '10px' }}>System Live</small>
                </div>
                <h2 className="fw-bold display-6 mb-0 text-primary">Management Dashboard</h2>
                <p className="text-muted mb-0">Real-time visitor analytics and audit logs.</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-white border bg-white shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-bold small">
                  <Download size={18} /> Export
                </button>
                <button className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 fw-bold small shadow">
                  <Calendar size={18} /> {new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}
                </button>
              </div>
            </div>

            {/* KPI CARDS */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card border-0 border-start border-primary border-5 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                      <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3"><Users size={24} /></div>
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill d-flex align-items-center h-100 px-3">Live</span>
                    </div>
                    <h3 className="display-4 fw-bold mb-0">{stats.currentlyIn}</h3>
                    <p className="text-muted fw-bold text-uppercase small tracking-widest" style={{fontSize: '10px'}}>Active Visitors</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 border-start border-dark border-5 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                      <div className="bg-dark bg-opacity-10 text-dark p-2 rounded-3"><LayoutDashboard size={24} /></div>
                    </div>
                    <h3 className="display-4 fw-bold mb-0">{stats.totalToday}</h3>
                    <p className="text-muted fw-bold text-uppercase small tracking-widest" style={{fontSize: '10px'}}>Total Today</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 border-start border-success border-5 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                      <div className="bg-success bg-opacity-10 text-success p-2 rounded-3"><Clock size={24} /></div>
                    </div>
                    <h3 className="display-4 fw-bold mb-0">{stats.lastHour}</h3>
                    <p className="text-muted fw-bold text-uppercase small tracking-widest" style={{fontSize: '10px'}}>Last 60 Minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="card-header bg-light bg-opacity-50 border-0 p-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-uppercase small tracking-widest text-muted" style={{fontSize: '11px'}}>Master Visitor Log</h5>
                <div className="position-relative">
                  <Search className="position-absolute translate-middle-y top-50 start-0 ms-3 text-muted" size={16} />
                  <input type="text" className="form-control form-control-sm border-0 shadow-none ps-5 bg-white border" placeholder="Search..." style={{ width: '250px' }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-uppercase small fw-bold text-muted" style={{fontSize: '10px'}}>
                    <tr>
                      <th className="px-4 py-3 border-0">Visitor</th>
                      <th className="py-3 border-0">Phone</th>
                      <th className="py-3 border-0">Purpose</th>
                      <th className="py-3 border-0">Host</th>
                      <th className="py-3 border-0">Time In</th>
                      <th className="py-3 border-0">Time Out</th>
                      <th className="py-3 border-0 text-end pe-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td className="px-4 py-3 fw-bold">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light rounded-2 text-muted fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '10px' }}>
                              {log.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {log.name}
                          </div>
                        </td>
                        <td className="text-muted">{log.phone}</td>
                        <td><span className="badge bg-light text-muted fw-bold text-uppercase py-1" style={{fontSize: '10px'}}>{log.purpose}</span></td>
                        <td className="fw-bold text-secondary">{log.host}</td>
                        <td className="text-muted">
                          <div className="lh-sm">
                            <div className="small">{new Date(log.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="text-muted" style={{ fontSize: '10px' }}>{new Date(log.checkIn).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="text-muted">
                          {log.checkOut ? (
                            <div className="lh-sm">
                              <div className="small">{new Date(log.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              <div className="text-muted" style={{ fontSize: '10px' }}>{new Date(log.checkOut).toLocaleDateString()}</div>
                            </div>
                          ) : <span className="text-primary fw-bold fst-italic" style={{fontSize: '12px'}}>Inside</span>}
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            {log.status === 'active' ? (
                              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-bold text-uppercase py-1 px-3" style={{ fontSize: '10px' }}>On Premise</span>
                            ) : (
                              <span className="badge bg-light text-muted rounded-pill fw-bold text-uppercase py-1 px-3" style={{ fontSize: '10px' }}>Exited</span>
                            )}
                            <button className="btn btn-link text-muted p-0"><MoreVertical size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* VIEW: SUCCESS SCREEN */}
      {view === 'success' && (
        <div className="success-overlay animate-in">
          <div className={`p-4 rounded-circle mb-4 ${successType === 'in' ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>
            <CheckCircle2 size={80} strokeWidth={3} />
          </div>
          <h2 className="display-4 fw-bold text-dark mb-3">
            {successType === 'in' ? 'Check-In Complete' : 'Check-Out Complete'}
          </h2>
          <p className="lead text-muted max-w-md">
            {successType === 'in' ? 'Welcome! Enjoy your visit to our facilities.' : 'Thank you for visiting. Please come again soon!'}
          </p>
          <div className="progress-bar-custom">
            <div className="progress-inner"></div>
          </div>
          <p className="text-uppercase fw-bold text-muted mt-3 tracking-widest" style={{ fontSize: '10px' }}>Resetting for next visitor</p>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-5 border-top bg-white">
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-md-auto text-muted small fw-medium">
              © 2024 FrontDesk Digital Logbook System. All rights reserved.
            </div>
            <div className="col-md-auto">
              <div className="d-flex gap-4">
                <button className="btn btn-link p-0 text-decoration-none text-muted small">Privacy Policy</button>
                <button className="btn btn-link p-0 text-decoration-none text-muted small">Help Center</button>
                <button className="btn btn-link p-0 text-decoration-none text-muted small">Building Info</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}