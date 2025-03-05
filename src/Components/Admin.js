import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white" style={{ minHeight: '100vh', width: '250px' }}>
        <h2 className="text-center py-3">Quản Trị</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="#">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="#">Tin Tức</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="#">Người Dùng</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="#">Cài Đặt</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="#">Đăng Xuất</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <header className="bg-primary text-white p-3 rounded mb-4">
          <h1 className="h4">Dashboard</h1>
        </header>
        
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Thông tin tổng quan</h5>
                  <p className="card-text">Một số thông tin và thống kê liên quan đến hệ thống.</p>
                  <Link to="#" className="btn btn-primary">Xem chi tiết</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tin tức mới nhất</h5>
                  <p className="card-text">Cập nhật những tin tức mới nhất từ hệ thống.</p>
                  <Link to="#" className="btn btn-primary">Xem chi tiết</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar a {
          color: white;
        }
        .sidebar a:hover {
          background-color: #495057;
        }
      `}</style>
    </div>
  );
};

export default Admin;