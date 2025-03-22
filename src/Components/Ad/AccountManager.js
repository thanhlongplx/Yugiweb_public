import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Spinner, Badge } from "react-bootstrap";

const AccountManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State for register modal
  const [newUserPassword, setNewUserPassword] = useState(""); // Password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!newUserName.trim() || !newUserRole) {
        toast.warning("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/user/update/${editingUser.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
          }),
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
      toast.success("User updated successfully!");
      handleCloseModal();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("");
  };

  const handleRegisterUser = async () => {
    try {
      if (!newUserName.trim() || !newUserPassword || !confirmPassword) {
        toast.warning("Please fill all required fields");
        return;
      }

      if (newUserPassword !== confirmPassword) {
        toast.warning("Passwords do not match");
        return;
      }

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName,
          username: newUserName, // Consider changing this to a separate username field if needed
          passWord: newUserPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register user");
      }

      const data = await response.json();
      toast.success(data.message);
      handleCloseRegisterModal();
      fetchUsers(); // Refresh the user list
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    setNewUserName("");
    setNewUserPassword("");
    setConfirmPassword("");
  };

  const handleDeleteUser = async (username) => {
    setConfirmDelete(username);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/delete/${confirmDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.username !== confirmDelete)
      );
      toast.success("User deleted successfully!");
      setConfirmDelete(null);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  const getRoleBadge = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "customer":
        return <Badge bg="success">Customer</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-dark text-white p-3 sticky-top shadow">
        <div className="container ">
          <div className="d-flex justify-content-between align-items-center ">
            <h1 className="h4 mb-0">Account Management</h1>
            <Link to="/Admin.html" className="btn btn-outline-light btn-sm">
              <i className="bi bi-arrow-left me-1"></i>Back to Admin Dashboard
            </Link>
            {/* Button to open register modal */}
            <Button variant="success" onClick={() => setShowRegisterModal(true)}>
              <i className="bi bi-person-plus me-1"></i> Register User
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light bg-dark">
        <div className="container">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">User Accounts</h2>
                <Badge bg="primary" pill>
                  {filteredUsers.length} Users
                </Badge>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6 mb-2 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-md-end">
                  <button
                    className="btn btn-outline-primary"
                    onClick={fetchUsers}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh Data
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading user data...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th
                          onClick={() => handleSort("username")}
                          className="user-select-none"
                        >
                          <div className="d-flex align-items-center">
                            Username
                            {getSortIndicator("username")}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort("name")}
                          className="user-select-none"
                        >
                          <div className="d-flex align-items-center">
                            Name
                            {getSortIndicator("name")}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort("email")}
                          className="user-select-none"
                        >
                          <div className="d-flex align-items-center">
                            Email
                            {getSortIndicator("email")}
                          </div>
                        </th>
                        <th
                          onClick={() => handleSort("role")}
                          className="user-select-none"
                        >
                          <div className="d-flex align-items-center">
                            Role
                            {getSortIndicator("role")}
                          </div>
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.username}>
                            <td>
                              <strong>{user.username}</strong>
                            </td>
                            <td>{user.name}</td>
                            <td>
                              <a href={`mailto:${user.email}`}>{user.email}</a>
                            </td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>
                              <div className="btn-group">
                                {sessionStorage.getItem("userUsername") !==
                                  user.username &&
                                !sessionStorage.getItem("userUsername")
                                  .isAdmin ? (
                                  <>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <i className="bi bi-pencil-square me-1"></i>
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleDeleteUser(user.username)
                                      }
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  </>
                                ) : sessionStorage.getItem("userUsername")
                                    .isAdmin ? (
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleDeleteUser(user.username)
                                    }
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <i className="bi bi-search fs-4 d-block mb-2 text-muted"></i>
                            No users found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-gear me-2"></i>
            Edit User: {editingUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user's name"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user's email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateUser}
            disabled={!newUserName.trim() || !newUserRole}
          >
            Update User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Registration Modal */}
      <Modal show={showRegisterModal} onHide={handleCloseRegisterModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus me-2"></i>
            Register New User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user's name"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRegisterModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRegisterUser}
            disabled={!newUserName.trim() || !newUserPassword || !confirmPassword}
          >
            Register User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={confirmDelete !== null} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
          <div className="alert alert-warning mt-3">
            <strong>Username:</strong> {confirmDelete}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />

      <style jsx>{`
        .table th {
          cursor: pointer;
        }
        .table th:hover {
          background-color: #f8f9fa;
        }

        /* Add Bootstrap Icons */
        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");
      `}</style>
    </div>
  );
};

export default AccountManager;