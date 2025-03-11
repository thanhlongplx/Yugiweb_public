import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa tất cả thông tin người dùng khỏi storage
    localStorage.clear(); // Xóa toàn bộ localStorage
    sessionStorage.clear(); // Xóa toàn bộ sessionStorage

    alert("Đăng xuất thành công");
    navigate("/LoginForm.html"); // Điều hướng đến trang đăng nhập
  };

  return (
    <div className="container mt-5">
      <div className=" shadow">
        <div className=" text-center">
          <h1 className="mb-4">Bạn có chắc chắn muốn đăng xuất?</h1>
          <button className="btn btn-danger btn-lg" onClick={handleLogout}>
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
