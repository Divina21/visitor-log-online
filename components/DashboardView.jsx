import { Users, LayoutDashboard, Clock, Search, Calendar, Download, MoreVertical } from 'lucide-react';

export default function DashboardView({ stats, logs, searchQuery, setSearchQuery }) {
  return (
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
  );
}
