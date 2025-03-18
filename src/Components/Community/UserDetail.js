import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDetail = () => {
  const { username } = useParams(); // Lấy username từ URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [friends, setFriends] = useState([]); // Danh sách bạn bè

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`);
        if (!response.ok) {
          throw new Error("Unable to fetch user details");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php"
        );
        if (!response.ok) {
          throw new Error("Unable to fetch card information");
        }
        const data = await response.json();
        setCards(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/friends/${sessionStorage.getItem("userUsername")}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch friends list");
        }
        const data = await response.json();
        setFriends(data.map((friend) => friend.username)); // Lấy username từ danh sách bạn bè
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetail();
    fetchCards();
    fetchFriends();
  }, [username]);

  const sendFriendRequest = async () => {
    if (!user) {
      alert("User not found!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUsername: sessionStorage.getItem("userUsername"), // Tên người gửi
          receiverUsername: username, // Tên người nhận
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unable to send friend request");
      }

      alert("Friend request sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFriend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: sessionStorage.getItem("userUsername"), // Tên người dùng hiện tại
          friendUsername: username, // Tên người bạn cần xóa
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unable to remove friend");
      }

      alert("Friend removed successfully!");
      // Cập nhật lại danh sách bạn bè sau khi xóa
      setFriends(friends.filter((friend) => friend !== username));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  const userCards = user.collection
    .map((cardName) => cards.find((card) => card.name === cardName))
    .filter(Boolean);

  const isFriend = friends.includes(username); // Kiểm tra nếu user đang xem là bạn

  return (
    <div className="container mt-5 pb-5">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: "80px", height: "80px" }}>
              <i className="bi bi-person-circle fs-1 text-secondary"></i>
            </div>
            <h2 className="fw-bold">{username}'s Profile</h2>
            <div className="badge bg-info fs-6 mt-2">
              <i className="bi bi-coin me-1"></i>
              {user.coin} Coins
            </div>
          </div>
          
          <div className="d-flex justify-content-center mb-4">
            {isFriend ? (
              <button 
                className="btn btn-danger" 
                onClick={removeFriend}
                onMouseOver={(e) => e.currentTarget.classList.add('btn-lg')}
                onMouseOut={(e) => e.currentTarget.classList.remove('btn-lg')}
                style={{ transition: "all 0.2s ease" }}
              >
                <i className="bi bi-person-dash me-1"></i>
                Remove Friend
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={sendFriendRequest}
                onMouseOver={(e) => e.currentTarget.classList.add('btn-lg')}
                onMouseOut={(e) => e.currentTarget.classList.remove('btn-lg')}
                style={{ transition: "all 0.2s ease" }}
              >
                <i className="bi bi-person-plus me-1"></i>
                Send Friend Request
              </button>
            )}
          </div>
        </div>
      </div>
  
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-collection me-2"></i>
            Card Collection
            {userCards.length > 0 && (
              <span className="badge bg-primary rounded-pill ms-2">{userCards.length}</span>
            )}
          </h5>
        </div>
        <div className="card-body">
          {userCards.length > 0 ? (
            <div className="row">
              {userCards.map((card) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={card.id}>
                  <div 
                    className="card h-100 border-0 shadow-sm" 
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px) scale(1.03)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}
                  >
                    <div className="position-relative">
                      <img
                        src={card.card_images[0].image_url}
                        className="card-img-top"
                        alt={card.name}
                        loading="lazy"
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
                        <small className="text-truncate d-block">{card.name}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              No cards in the collection yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;