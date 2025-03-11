import React, { useEffect, useState } from "react"; // Nhập React và các hook
import { Link } from "react-router-dom"; // Nhập Link để điều hướng
import "bootstrap/dist/css/bootstrap.min.css"; // Nhập Bootstrap CSS để sử dụng các lớp kiểu
import ".././Css/Ad.css"; // Nhập CSS tùy chỉnh cho component

const AccountManager = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có
  const [expandedUser, setExpandedUser] = useState(null); // Người dùng đang mở rộng để xem chi tiết
  const [editingCard, setEditingCard] = useState(null); // Thẻ bài đang được chỉnh sửa
  const [newCardName, setNewCardName] = useState(""); // Tên thẻ bài mới
  const [editingUser, setEditingUser] = useState(null); // Người dùng đang được chỉnh sửa
  const [newUserName, setNewUserName] = useState(""); // Tên người dùng mới
  const [newUserEmail, setNewUserEmail] = useState(""); // Email người dùng mới

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

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const toggleUserExpansion = (email) => {
    setExpandedUser(expandedUser === email ? null : email);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setNewCardName(card);
  };

  const handleUpdateCard = async (userEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/update-card/${userEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldCardName: editingCard, newCardName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update card");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === updatedUser.email ? updatedUser : user
        )
      );
      setEditingCard(null);
      setNewCardName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/update/${editingUser.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newUserName, email: newUserEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === updatedUser.email ? updatedUser : user
        )
      );
      setEditingUser(null);
      setNewUserName("");
      setNewUserEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Hàm xóa thẻ bài
  const handleDeleteCard = async (userEmail, cardName) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ bài này?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/remove-from-collection`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail, cardName }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to delete card");
        }
  
        const updatedUser = await response.json();
  
        // Cập nhật danh sách thẻ bài ngay lập tức
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === updatedUser.email ? updatedUser : user
          )
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/delete/${email}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== email)
        );
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
      {/* Header */}
      <header className="bg-primary text-white p-3">
        <h1 className="h4 text-center">Quản Trị</h1>
      </header>

      {/* Main Content */}
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
                <th>Email</th>
                <th>Role</th>
                <th>Cards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() => toggleUserExpansion(user.email)}
                    >
                      {expandedUser === user.email ? "Hide" : "Show"}
                    </button>
                    {expandedUser === user.email && (
                      <ul className="list-unstyled mt-2">
                        {user.collection && user.collection.length > 0 ? (
                          user.collection.map((card, index) => (
                            <li className="cardNameItem" key={index}>
                              {card}
                              <button
                                className="editBtn btn-warning btn-sm ms-2"
                                onClick={() => handleEditCard(card)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() =>
                                  handleDeleteCard(user.email, card)
                                } // Gọi hàm xóa thẻ bài
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>No cards</li>
                        )}
                      </ul>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteUser(user.email)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phần chỉnh sửa thẻ bài */}
          {editingCard && (
            <div className="editCard mt-3 p-2">
              <h5 className="text-white">Chỉnh sửa thẻ bài của</h5>
              <input
                type="text"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                className="form-control mb-2 text-white bg-black"
                placeholder="Tên thẻ bài mới"
              />
              <button
                className="btn btn-success"
                onClick={() =>
                  handleUpdateCard(
                    users.find((user) => user.collection.includes(editingCard))
                      .email
                  )
                }
              >
                Cập nhật
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setEditingCard(null)}
              >
                Hủy
              </button>
            </div>
          )}

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
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="form-control mb-2 text-white bg-black"
                placeholder="Email người dùng mới"
              />
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

      {/* Style cho header */}
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

export default AccountManager;