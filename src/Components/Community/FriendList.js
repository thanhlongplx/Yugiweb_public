import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const FriendList = () => {
  // Khai báo state để lưu danh sách yêu cầu kết bạn, bạn bè, trạng thái loading và lỗi
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy username từ sessionStorage hoặc gán giá trị mặc định "User"
  const username = sessionStorage.getItem("userUsername") || "User";

  useEffect(() => {
    // Hàm để lấy danh sách yêu cầu kết bạn
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/friend-requests/${username}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch friend requests");
        }
        const data = await response.json();
        setFriendRequests(data); // Lưu dữ liệu yêu cầu kết bạn vào state
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi nếu có
      }
    };

    // Hàm để lấy danh sách bạn bè
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/friends/${username}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch friends");
        }
        const data = await response.json();
        
        
        setFriends(data); // Lưu dữ liệu bạn bè vào state
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi nếu có
      }
    };

    // Hàm để gọi cả hai hàm fetch
    const fetchData = async () => {
      setLoading(true); // Đặt trạng thái loading là true
      await Promise.all([fetchFriendRequests(), fetchFriends()]); // Chờ cả hai hàm fetch hoàn thành
      setLoading(false); // Đặt trạng thái loading là false
    };

    fetchData(); // Gọi hàm fetchData
  }, [username]); // Chạy lại khi username thay đổi

  // Hàm để làm mới dữ liệu
  const refreshData = async () => {
    await Promise.all([
      fetch(`http://localhost:5000/api/friend-requests/${username}`)
        .then((response) => response.json())
        .then((data) => setFriendRequests(data))
        .catch((err) => setError(err.message)),
      fetch(`http://localhost:5000/api/friends/${username}`)
        .then((response) => response.json())
        .then((data) => setFriends(data))
        .catch((err) => setError(err.message)),
    ]);
  };

  // Nếu đang loading, hiển thị thông báo loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Hàm để chấp nhận yêu cầu kết bạn
  const acceptRequest = async (nameAcept) => {
    // Hiển thị hộp thoại xác nhận
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn chấp nhận yêu cầu kết bạn từ " + nameAcept + "?"
    );
    

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/friend-request/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nameAcept, username }), // Gửi cả name và username
        }
      );
      if (!response.ok) {
        throw new Error("Unable to accept friend request");
      }
      await refreshData(); // Làm mới dữ liệu sau khi chấp nhận
    } catch (err) {
      alert(err.message); // Hiển thị thông báo lỗi nếu có
    }
  };

  // Hàm để từ chối yêu cầu kết bạn
  const declineRequest = async (name) => {
    // Hiển thị hộp thoại xác nhận
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn từ chối yêu cầu kết bạn từ " + name + "?"
    );

    if (!confirmed) {
      return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/friend-request/decline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, username }), // Gửi cả name và username
        }
      );

      if (!response.ok) {
        throw new Error("Unable to decline friend request");
      }
      await refreshData(); // Làm mới dữ liệu sau khi từ chối
    } catch (err) {
      alert(err.message); // Hiển thị thông báo lỗi nếu có
    }
  };

  return (
    <div className=" row" style={{ marginBottom: "100px" }}>
      <h2 className="text-center mb-4 fw-bold">Friend List</h2>

      {/* Friend Requests Section */}
      <div className=" h-100 col col-lg-6 shadow-sm  border-2">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Friend Requests
            {friendRequests.length > 0 && (
              <span className="badge bg-primary rounded-pill ms-2">
                {friendRequests.length}
              </span>
            )}
          </h5>
        </div>

        <div className="card-body">
          {friendRequests.length > 0 ? (
            <ul className="list-group list-group-flush">
              {friendRequests.map((request) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom"
                  key={request._id}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                    <span className="fw-medium">{request.name}</span>
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => acceptRequest(request.username)}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Accept
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => declineRequest(request.username)}
                    >
                      <i className="bi bi-x-lg me-1"></i>
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-warning d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              No friend requests at the moment.
            </div>
          )}
        </div>
      </div>

      {/* Friends List Section */}
      <div className=" h-100 col col-lg-6 shadow-sm border-2">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            Your Friends
            {friends.length > 0 && (
              <span className="badge bg-info rounded-pill ms-2">
                {friends.length}
              </span>
            )}
          </h5>
        </div>

        <div className="card-body">
          {friends.length > 0 ? (
            <ul className="list-group list-group-flush">
              {friends.map((friend) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom hover-effect"
                  key={friend._id}
                  style={{ transition: "all 0.2s ease" }}
                  onMouseOver={(e) => e.currentTarget.classList.add("bg-light")}
                  onMouseOut={(e) =>
                    e.currentTarget.classList.remove("bg-light")
                  }
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-info bg-opacity-25 d-flex justify-content-center align-items-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className="bi bi-person-check"></i>
                    </div>
                    <span>{friend.name}</span>
                  </div>
                  <Link
                    to={`/user/${friend.username}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    View Profile
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-warning d-flex align-items-center">
              <i className="bi bi-people-fill me-2"></i>
              No friends yet. Start connecting with others!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
