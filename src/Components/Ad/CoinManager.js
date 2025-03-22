import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Alert, Modal, Button, Form, Badge } from "react-bootstrap";

const CoinManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newCoinAmount, setNewCoinAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
    setShowModal(true);
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
          body: JSON.stringify({ coin: parseInt(newCoinAmount) }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update coin");
      }

      const updatedUser = await response.json();

      // Update user list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === updatedUser.email ? updatedUser : user
        )
      );

      setUpdateSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setEditingUser(null);
        setNewCoinAmount("");
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setNewCoinAmount("");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark">
      {/* Header */}
      <header className="bg-dark border-2 border text-white p-3 sticky-top shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Coin Manager</h1>
            <Link to="/Admin.html" className="btn btn-outline-light btn-sm">
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-dark flex-grow-1 py-4 bg-light">
        <div className="container">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              Error: {error}
            </Alert>
          )}

          <div className="card bg-dark shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">User Coin Management</h2>
              <Badge bg="primary" pill>
                {users.length} Users
              </Badge>
            </div>
            {/* Phan bang ben tren */}
            <div className="card-body btn-outline-light bg-dark p-0">
              <div className="table-responsive">
                <table className="table table-hover border-2 border  table-striped align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Coin Balance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-dark">
                    {users.map((user) => (
                      <tr key={user.email}>
                        <td className="fw-bold">{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg="success" className="fs-6">
                            {user.coin}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit Coins
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            {users.map((user) => (
              <div className="col-md-6 col-lg-4 mb-4" key={user.email}>
                <div className="card h-100 border-0 shadow-sm user-card">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">{user.username}</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <small className="text-muted d-block">Name</small>
                      <div>{user.name}</div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block">Email</small>
                      <div>{user.email}</div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block">Coin Balance</small>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-coin text-warning me-2 fs-4"></i>
                        <span className="fs-4 fw-bold">{user.coin}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-0">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleEditUser(user)}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Coin Balance
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <div className="container">
          <small>
            Coin Manager Admin Panel &copy; {new Date().getFullYear()}
          </small>
        </div>
      </footer>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Coin Balance - {editingUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateSuccess ? (
            <Alert variant="success">Coin balance updated successfully!</Alert>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Balance:</Form.Label>
                <h4>{editingUser?.coin}</h4>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Coin Balance:</Form.Label>
                <Form.Control
                  type="number"
                  value={newCoinAmount}
                  onChange={(e) => setNewCoinAmount(e.target.value)}
                  placeholder="Enter new coin amount"
                  autoFocus
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {!updateSuccess && (
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateCoin}
              disabled={!newCoinAmount || isNaN(parseInt(newCoinAmount))}
            >
              Update Balance
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      <style jsx>{`
        .user-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .user-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }

        /* Add Bootstrap Icons */
        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");
      `}</style>
    </div>
  );
};

export default CoinManager;
