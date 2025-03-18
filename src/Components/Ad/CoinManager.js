import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CoinManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newCoinAmount, setNewCoinAmount] = useState("");

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
    setNewCoinAmount(user.coin);
  };

  const handleUpdateCoin = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/update-coin/${editingUser.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coin: newCoinAmount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update coin");
      }

      const updatedUser = await response.json();

      // Cập nhật danh sách người dùng
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === updatedUser.email ? updatedUser : user
        )
      );

      setEditingUser(null);
      setNewCoinAmount("");
    } catch (err) {
      setError(err.message);
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
        <h1 className="h4 text-center">Quản Lý Coin</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="container">
          <h2 className="mb-4">Quản lý Số Coin</h2>

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
                <th>Coin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.coin}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Chỉnh sửa Coin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <div className="editCard mt-3 p-2">
              <h5 className="text-white">Chỉnh sửa số Coin</h5>
              <input
                type="number"
                value={newCoinAmount}
                onChange={(e) => setNewCoinAmount(e.target.value)}
                className="form-control mb-2 text-white bg-black"
                placeholder="Số coin mới"
              />
              <button className="btn btn-success" onClick={handleUpdateCoin}>
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

export default CoinManager;
