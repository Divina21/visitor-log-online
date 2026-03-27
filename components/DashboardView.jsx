import { useState, useRef, useEffect, useMemo } from 'react';
import { Users, LayoutDashboard, Clock, Search, Calendar, Download, MoreVertical, Edit3, Trash2, X } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function DashboardView({ stats, logs, searchQuery, setSearchQuery, onEditVisitor, onDeleteVisitor }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [deletingLog, setDeletingLog] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', purpose: '', host: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const menuRef = useRef(null);

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(l =>
      l.fullName.toLowerCase().includes(q) ||
      String(l.phoneNumber).includes(q) ||
      (l.purpose || '').toLowerCase().includes(q) ||
      (l.host || '').toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const openEdit = (log) => {
    setEditForm({
      fullName: log.fullName || '',
      phoneNumber: String(log.phoneNumber || ''),
      purpose: Array.isArray(log.purpose) ? log.purpose[0] || '' : log.purpose || '',
      host: log.host || '',
    });
    setEditingLog(log);
    setOpenMenuId(null);
  };

  const openDelete = (log) => {
    setDeletingLog(log);
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await onEditVisitor(editingLog.id, editForm);
      setEditingLog(null);
    } catch (err) {
      alert('Failed to update visitor: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDeleteVisitor(deletingLog.id);
      setDeletingLog(null);
    } catch (err) {
      alert('Failed to delete visitor: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    const data = filteredLogs.map(l => ({
      'Full Name': l.fullName,
      'Phone Number': l.phoneNumber,
      'Purpose': l.purpose || '',
      'Host': l.host,
      'Check-In': l.checkInTime ? new Date(l.checkInTime).toLocaleString() : '',
      'Check-Out': l.checkOutTime ? new Date(l.checkOutTime).toLocaleString() : '',
      'Status': l.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitor Log');
    XLSX.writeFile(wb, `visitor-log-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
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
          <button onClick={handleExport} className="btn btn-white border bg-white shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-bold small">
            <Download size={18} /> Export
          </button>
          <button className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 fw-bold small shadow">
            <Calendar size={18} /> {new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card border-0 border-start border-primary border-5 shadow-sm rounded-4 p-2 h-100 bg-white">
            <div className="card-body py-2 px-3">
              <div className="d-flex justify-content-between mb-2">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3"><Users size={20} /></div>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill d-flex align-items-center h-100 px-2" style={{fontSize: '10px'}}>Live</span>
              </div>
              <h3 className="display-6 fw-bold mb-0">{stats.currentlyIn}</h3>
              <p className="text-muted fw-bold text-uppercase small tracking-widest mb-0" style={{fontSize: '10px'}}>Active Visitors</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 border-start border-dark border-5 shadow-sm rounded-4 p-2 h-100 bg-white">
            <div className="card-body py-2 px-3">
              <div className="d-flex justify-content-between mb-2">
                <div className="bg-dark bg-opacity-10 text-dark p-2 rounded-3"><LayoutDashboard size={20} /></div>
              </div>
              <h3 className="display-6 fw-bold mb-0">{stats.totalToday}</h3>
              <p className="text-muted fw-bold text-uppercase small tracking-widest mb-0" style={{fontSize: '10px'}}>Total Today</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 border-start border-success border-5 shadow-sm rounded-4 p-2 h-100 bg-white">
            <div className="card-body py-2 px-3">
              <div className="d-flex justify-content-between mb-2">
                <div className="bg-success bg-opacity-10 text-success p-2 rounded-3"><Clock size={20} /></div>
              </div>
              <h3 className="display-6 fw-bold mb-0">{stats.lastHour}</h3>
              <p className="text-muted fw-bold text-uppercase small tracking-widest mb-0" style={{fontSize: '10px'}}>Last 60 Minutes</p>
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
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="px-4 py-3 fw-bold">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-2 text-muted fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '10px' }}>
                        {log.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {log.fullName}
                    </div>
                  </td>
                  <td className="text-muted">{log.phoneNumber}</td>
                  <td><span className="badge bg-light text-muted fw-bold text-uppercase py-1" style={{fontSize: '10px'}}>{log.purpose}</span></td>
                  <td className="fw-bold text-secondary">{log.host}</td>
                  <td className="text-muted">
                    <div className="lh-sm">
                      <div className="small">{new Date(log.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="text-muted" style={{ fontSize: '10px' }}>{new Date(log.checkInTime).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="text-muted">
                    {log.checkOutTime ? (
                      <div className="lh-sm">
                        <div className="small">{new Date(log.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>{new Date(log.checkOutTime).toLocaleDateString()}</div>
                      </div>
                    ) : <span className="text-primary fw-bold fst-italic" style={{fontSize: '12px'}}>Inside</span>}
                  </td>
                  <td className="text-end pe-4 position-relative">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      {log.status === 'active' ? (
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-bold text-uppercase py-1 px-3" style={{ fontSize: '10px' }}>On Premise</span>
                      ) : (
                        <span className="badge bg-light text-muted rounded-pill fw-bold text-uppercase py-1 px-3" style={{ fontSize: '10px' }}>Exited</span>
                      )}
                      <button className="btn btn-link text-muted p-0" onClick={() => setOpenMenuId(openMenuId === log.id ? null : log.id)}>
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === log.id && (
                        <div ref={menuRef} className="position-absolute end-0 mt-1 bg-white border rounded-3 shadow-lg py-1 z-3" style={{ minWidth: '150px' }}>
                          <button className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 small" onClick={() => openEdit(log)}>
                            <Edit3 size={14} /> Edit Visitor
                          </button>
                          <button className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 small text-danger" onClick={() => openDelete(log)}>
                            <Trash2 size={14} /> Delete Visitor
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingLog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-4 shadow-lg p-4" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Edit Visitor</h5>
              <button className="btn btn-link text-muted p-0" onClick={() => setEditingLog(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Full Name</label>
                <input type="text" className="form-control" value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Phone Number</label>
                <input type="text" className="form-control" value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Purpose</label>
                <input type="text" className="form-control" value={editForm.purpose} onChange={e => setEditForm({ ...editForm, purpose: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Host</label>
                <input type="text" className="form-control" value={editForm.host} onChange={e => setEditForm({ ...editForm, host: e.target.value })} required />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-light px-4" onClick={() => setEditingLog(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingLog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-4 shadow-lg p-4 text-center" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
              <Trash2 size={24} />
            </div>
            <h5 className="fw-bold mb-2 text-primary">Delete Visitor</h5>
            <p className="text-muted mb-4">
              Are you sure you want to delete <strong>{deletingLog.fullName}</strong>? This will permanently remove the entry from Contentful.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-light px-4" onClick={() => setDeletingLog(null)}>Cancel</button>
              <button className="btn btn-danger px-4 fw-bold" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
