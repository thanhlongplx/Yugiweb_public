import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi storage
    localStorage.removeItem("userEmail"); // Xóa email khi đăng xuất
    sessionStorage.removeItem("userEmail"); // Xóa email khỏi sessionStorage
    sessionStorage.removeItem("userCoin"); // Xóa email khỏi sessionStorage

    alert("Đăng xuất thành công");
    navigate("/LoginForm.html"); // Điều hướng đến trang đăng nhập
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bạn có chắc chắn muốn đăng xuất?</h1>
      <button className="btn btn-danger" onClick={handleLogout}>
        Đăng Xuất
      </button>
    </div>
  );
};

export default Logout;