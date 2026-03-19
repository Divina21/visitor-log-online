export default function Footer() {
  return (
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
  );
}
