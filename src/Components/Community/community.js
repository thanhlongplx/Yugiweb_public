import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/community.css"; // Thêm file CSS tùy chỉnh

const Community = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Cộng Đồng Người Dùng</h2>
      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-4" key={user.email}>
            <div className="community-card">
              <h5>
                <Link to={`/user/${user.username}`} className="text-light">
                  {user.name}
                </Link>
              </h5>
              <p>Email: {user.email}</p>
              <p>Số Coin: {user.coin}</p>
              <p>Số lượng thẻ: {user.collection.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;