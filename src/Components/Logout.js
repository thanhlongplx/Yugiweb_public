import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const Logout = () => {
  const navigate = useNavigate();
  toast.success("Đăng xuất thành công!");

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi storage
    localStorage.clear();
    sessionStorage.clear();

   
    navigate("/LoginForm.html");
  };

  // Xử lý khi người dùng chọn không đăng xuất
  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    
    <div style={styles.container}>
      <ToastContainer /> {/* Thêm ToastContainer vào render */}
      <div style={styles.card}>
        <h2 style={styles.title}>Bạn muốn đăng xuất?</h2>
        <p style={styles.message}>
          Bạn chắc chắn muốn rời khỏi phiên làm việc hiện tại chứ?
        </p>
        
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.button, ...styles.cancelButton}}
            onClick={handleCancel}
          >
            Không, quay lại
          </button>
          <button 
            style={{...styles.button, ...styles.logoutButton}}
            onClick={handleLogout}
          >
            Đăng xuất ngay 😏
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    minWidth: "300px",
  },
  title: {
    marginBottom: "1rem",
    color: "#333",
    fontSize: "1.5rem",
  },
  message: {
    marginBottom: "2rem",
    color: "#666",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    color: "white",
  }
};

export default Logout;