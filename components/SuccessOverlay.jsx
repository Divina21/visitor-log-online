import { CheckCircle2 } from 'lucide-react';

export default function SuccessOverlay({ successType }) {
  return (
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
  );
}
