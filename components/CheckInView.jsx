import { ChevronLeft, User, Phone, Users, CheckCircle2 } from 'lucide-react';

export default function CheckInView({ setView, formData, setFormData, onSubmit }) {
  return (
    <div className="mx-auto animate-in" style={{ maxWidth: '800px' }}>
      <button onClick={() => setView('home')} className="btn btn-link text-decoration-none text-secondary fw-bold mb-4 p-0 d-inline-flex align-items-center gap-1">
        <ChevronLeft size={20} /> Back to Reception
      </button>
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Visitor Check-In</h2>
        <p className="text-muted">Please fill in your details to register.</p>
      </div>
      
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
        <form onSubmit={onSubmit} className="row g-4">
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
  );
}
