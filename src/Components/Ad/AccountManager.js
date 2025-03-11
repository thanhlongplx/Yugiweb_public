import React, { useEffect, useState } from "react"; // Nhập React và các hook
import { Link } from "react-router-dom"; // Nhập Link để điều hướng
import "bootstrap/dist/css/bootstrap.min.css"; // Nhập Bootstrap CSS để sử dụng các lớp kiểu
import "../Css/Ad.css"; // Nhập CSS tùy chỉnh cho component
import { ToastContainer, toast } from "react-toastify"; // Nhập toast
import "react-toastify/dist/ReactToastify.css"; // Nhập CSS cho toast

const AccountManager = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có
  const [editingUser, setEditingUser] = useState(null); // Người dùng đang được chỉnh sửa
  const [newUserName, setNewUserName] = useState(""); // Tên người dùng mới
  const [newUserEmail, setNewUserEmail] = useState(""); // Email người dùng mới
  const [newUserRole, setNewUserRole] = useState(""); // Role người dùng mới

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email); // Lấy email người dùng
    setNewUserRole(user.role);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/update/${editingUser.username}`, // Sử dụng username
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newUserName, email: newUserEmail, role: newUserRole }), // Cập nhật thông tin
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user
        )
      );
      toast.success("Cập nhật người dùng thành công!");
      setEditingUser(null);
      setNewUserName("");
      setNewUserEmail(""); // Reset email
      setNewUserRole("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/delete/${username}`, // Sử dụng username
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== username)
        );
        toast.success("Xóa người dùng thành công!");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <header className="bg-primary text-white p-3">
        <h1 className="h4 text-center">Quản Trị</h1>
      </header>

      <div className="flex-grow-1 p-4">
        <div className="container">
          <h2 className="mb-4">Quản lý Tài Khoản</h2>

          <div className="mb-3">
            <Link to="/Admin.html" className="btn btn-primary me-2">
              Quay lại
            </Link>
          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th> {/* Thêm cột Email */}
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td> {/* Hiển thị email */}
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteUser(user.username)} // Sử dụng username
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phần chỉnh sửa thông tin người dùng */}
          {editingUser && (
            <div className="editCard mt-3 p-2">
              <h5 className="text-white">Chỉnh sửa thông tin người dùng</h5>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="form-control mb-2 text-white bg-black"
                placeholder="Tên người dùng mới"
              />
             
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="form-control mb-2 text-white bg-black"
              >
                <option value="" disabled>Chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <button className="btn btn-success" onClick={handleUpdateUser}>
                Cập nhật
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setEditingUser(null)}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AccountManager;