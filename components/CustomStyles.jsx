export default function CustomStyles() {
  return (
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
}
