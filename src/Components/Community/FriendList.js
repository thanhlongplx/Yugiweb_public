import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

const FriendList = () => {
  // State declarations
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Get username from sessionStorage
  const username = sessionStorage.getItem("userUsername") || "User";

  // Display toast notification
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    // Function to fetch friend requests
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/friend-requests/${username}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch friend requests");
        }
        const data = await response.json();
        setFriendRequests(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Function to fetch friends
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/friends/${username}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch friends");
        }
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Function to fetch all data
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFriendRequests(), fetchFriends()]);
      setLoading(false);
    };

    fetchData();
  }, [username]);

  // Function to refresh data
  const refreshData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetch(`http://localhost:5000/api/friend-requests/${username}`)
          .then((response) => response.json())
          .then((data) => setFriendRequests(data)),
        fetch(`http://localhost:5000/api/friends/${username}`)
          .then((response) => response.json())
          .then((data) => setFriends(data)),
      ]);
    } catch (err) {
      setError(err.message);
      showNotification("Failed to refresh data", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Function to accept friend request
  const acceptRequest = async (nameAcept) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/friend-request/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nameAcept, username }),
        }
      );
      if (!response.ok) {
        throw new Error("Unable to accept friend request");
      }
      await refreshData();
      showNotification("Friend request accepted successfully!");
    } catch (err) {
      showNotification(err.message, "danger");
    }
  };

  // Function to decline friend request
  const declineRequest = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/friend-request/decline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, username }),
        }
      );
      if (!response.ok) {
        throw new Error("Unable to decline friend request");
      }
      await refreshData();
      showNotification("Friend request declined", "warning");
    } catch (err) {
      showNotification(err.message, "danger");
    }
  };

  // Confirmation dialog for accepting/declining requests
  const confirmAction = (action, name) => {
    const message =
      action === "accept"
        ? `Are you sure you want to accept the friend request from ${name}?`
        : `Are you sure you want to decline the friend request from ${name}?`;

    if (window.confirm(message)) {
      action === "accept" ? acceptRequest(name) : declineRequest(name);
    }
  };

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading your connections...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4 d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <strong>Error:</strong> {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={refreshData}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white">
      <div className="container py-4">
        {/* Toast notifications */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            bg={toastType}
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className={toastType === "danger" ? "text-white" : ""}>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>

        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4 fw-bold">
              <i className="bi bi-people-fill me-2"></i>
              Your Connections
            </h2>
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={refreshData}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Friend Requests Section */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-person-plus me-2"></i>
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
                            style={{ width: "48px", height: "48px" }}
                          >
                            <i className="bi bi-person fs-4"></i>
                          </div>
                          <div>
                            <span className="fw-bold">{request.name}</span>
                            <small className="text-muted d-block">
                              {request.username}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              confirmAction("accept", request.username)
                            }
                          >
                            <i className="bi bi-check-lg me-1"></i>
                            Accept
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              confirmAction("decline", request.username)
                            }
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
          </div>

          {/* Friends List Section */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Your Friends
                  {friends.length > 0 && (
                    <span className="badge bg-info rounded-pill ms-2">
                      {friends.length}
                    </span>
                  )}
                </h5>
                <div
                  className="input-group input-group-sm"
                  style={{ maxWidth: "200px" }}
                >
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="card-body">
                {filteredFriends.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {filteredFriends.map((friend) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom"
                        key={friend._id}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-info bg-opacity-25 d-flex justify-content-center align-items-center me-3"
                            style={{ width: "48px", height: "48px" }}
                          >
                            <i className="bi bi-person-check fs-4"></i>
                          </div>
                          <div>
                            <span className="fw-bold">{friend.name}</span>
                            <small className="text-muted d-block">
                              {friend.username}
                            </small>
                          </div>
                        </div>
                        <div className="dropdown">
                          <Link
                            to={`/user/${friend.username}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-box-arrow-up-right me-1"></i>
                            View Profile
                          </Link>
                          <button
                            className="btn btn-outline-secondary btn-sm ms-2"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#message">
                                <i className="bi bi-chat-dots me-2"></i>
                                Message
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#remove">
                                <i className="bi bi-person-dash me-2"></i>
                                Remove Friend
                              </a>
                            </li>
                          </ul>
                        </div>
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
              <div className="card-footer bg-light">
                <Link
                  to="/Community.html"
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  <i className="bi bi-person-plus-fill me-1"></i>
                  Find New Friends
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendList;