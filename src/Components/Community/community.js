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

  const formatNumber = (num) => {
    const roundedNum = (Math.round(num * 1000) / 1000).toFixed(1);
    const [integerPart, decimalPart] = roundedNum.split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger},${decimalPart}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mb-5">
      
      <h2 className="mb-4 text-center">Cộng Đồng Người Dùng</h2>
      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-4" key={user.email}>
            <div className="community-card">
              <h5>{user.name}</h5>
              <p>Email: {user.email}</p>
              <p>Số Coin: {formatNumber(user.coin)}</p> {/* Sử dụng hàm formatNumber */}
              <p>Số lượng thẻ: {user.collection.length}</p>
              <Link to={`/user/${user.username}`} className="text-light">
                Thông tin thẻ
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;