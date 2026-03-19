import { Building2, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ isLoggedIn, setView, setIsLoggedIn }) {
  return (
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
  );
}
