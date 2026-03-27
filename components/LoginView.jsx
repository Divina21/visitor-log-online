import { ShieldCheck } from 'lucide-react';

export default function LoginView({ setView, loginData, setLoginData, onSubmit, loginError }) {
  return (
    <div className="mx-auto pt-5 animate-in" style={{ maxWidth: '400px' }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 bg-white">
        <div className="card-body text-center">
          <div className="bg-dark text-white p-3 rounded-4 d-inline-block mb-4 shadow">
            <ShieldCheck size={40} />
          </div>
          <h3 className="fw-bold">Admin Login</h3>
          <p className="text-muted mb-4 small">Authorized personnel only</p>
          
          {loginError && (
            <div className="alert alert-danger small py-2 mb-3">{loginError}</div>
          )}

          <form onSubmit={onSubmit} className="text-start">
            <div className="mb-3">
              <label className="form-label fw-bold small">Username</label>
              <input required type="text" className="form-control form-control-lg bg-light border-0" placeholder="Username" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold small">Password</label>
              <input required type="password" className="form-control form-control-lg bg-light border-0" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-dark w-100 py-3 fw-bold rounded-4 shadow mb-3">Sign In</button>
            <button type="button" onClick={() => setView('home')} className="btn btn-link w-100 text-decoration-none text-muted small">Back to Kiosk</button>
          </form>
        </div>
      </div>
    </div>
  );
}
