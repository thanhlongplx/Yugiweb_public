import React from "react";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="bg-primary text-white p-3">
        <h1 className="h4 text-center">Quản Trị</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="container d-flex">
          <h2 className="mb-4 ">Quản lý</h2>

          <div className="mb-3 m-1">
            <Link to="/CoinManager.html" className="btn btn-primary me-2">
              Coin Manager
            </Link>
          </div>
          <div className="mb-3 m-1">
            <Link to="/AccountManager.html" className="btn btn-primary me-2">
              Account Manager
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        header {
          position: sticky;
          top: 0;
          z-index: 100;
        }
      `}</style>
    </div>
  );
};

export default Admin;
