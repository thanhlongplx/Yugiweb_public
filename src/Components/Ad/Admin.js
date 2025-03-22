import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", background: "#f4f6f9" }}
    >
      {/* Header */}
      <header
        className="bg-gradient text-white p-4 shadow-lg text-center"
        style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}
      >
        <h1 className="h3 fw-bold">Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="container text-center">
          <h2 className="mb-4 fw-bold text-dark">Management Panel</h2>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3">
              <Link
                to="/CoinManager.html"
                className="btn btn-lg btn-gradient shadow-sm w-100"
              >
                💰 Coin Manager
              </Link>
            </div>
            <div className="col-md-4 mb-3">
              <Link
                to="/AccountManager.html"
                className="btn btn-lg btn-gradient shadow-sm w-100"
              >
                👤 Account Manager
              </Link>
            </div>
            <div className="col-md-4 mb-3">
              <Link
                to="/FeedbackList.html"
                className="btn btn-lg btn-gradient shadow-sm w-100"
              >
                💬 Feedback List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <p className="mb-0">&copy; 2025 Admin Panel. All Rights Reserved.</p>
      </footer>

      <style jsx>{`
        .btn-gradient {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: white;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0px 5px 15px rgba(255, 75, 43, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Admin;
