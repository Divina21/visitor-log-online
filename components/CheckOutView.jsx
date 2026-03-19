import { ChevronLeft, Search, Clock, Users, X } from 'lucide-react';

export default function CheckOutView({ setView, searchQuery, setSearchQuery, filteredActive, onCheckOut }) {
  return (
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
                  <button onClick={() => onCheckOut(visitor.id)} className="btn btn-light fw-bold text-dark px-3 rounded-3 border">Check Out</button>
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
  );
}
