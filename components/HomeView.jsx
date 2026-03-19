import { UserPlus, UserMinus, ArrowRight } from 'lucide-react';

export default function HomeView({ setView, stats }) {
  return (
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
  );
}
