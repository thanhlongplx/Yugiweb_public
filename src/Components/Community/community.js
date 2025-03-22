import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Card, Container, Row, Col, Alert, Badge } from "react-bootstrap";
import "../Css/community.css";

const Community = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) {
          throw new Error(`Failed to fetch users (Status: ${response.status})`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching users:", err);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const sortedAndFilteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "coinDesc":
          return b.coin - a.coin;
        case "coinAsc":
          return a.coin - b.coin;
        case "cardsDesc":
          return b.collection.length - a.collection.length;
        case "cardsAsc":
          return a.collection.length - b.collection.length;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-white mt-2">Loading user data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="bg-dark py-4">
      <Container>
        <h2 className="mb-4 text-center text-white">Community Members</h2>
        
        <div className="mb-4 bg-dark p-3 rounded">
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={6}>
              <select 
                className="form-select" 
                value={sortOption} 
                onChange={handleSort}
              >
                <option value="name">Sort by Name</option>
                <option value="coinDesc">Highest Coins</option>
                <option value="coinAsc">Lowest Coins</option>
                <option value="cardsDesc">Most Cards</option>
                <option value="cardsAsc">Fewest Cards</option>
              </select>
            </Col>
          </Row>
        </div>

        {sortedAndFilteredUsers.length === 0 ? (
          <Alert variant="info">No users found matching your search criteria.</Alert>
        ) : (
          <Row>
            {sortedAndFilteredUsers.map((user) => (
              <Col md={4} sm={6} className="mb-4" key={user.email}>
                <Card className="h-100 shadow-sm community-card">
                  <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">@{user.username}</Card.Subtitle>
                    <Card.Text>
                      <small className="text-muted d-block mb-2">{user.email}</small>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Coins:</span>
                        <Badge bg="warning" text="dark" className="p-2">
                          {formatNumber(user.coin)}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Cards:</span>
                        <Badge bg="info" className="p-2">
                          {user.collection.length}
                        </Badge>
                      </div>
                    </Card.Text>
                    <Link
                      to={`/user/${user.username}`}
                      className="btn btn-primary w-100"
                    >
                      View Cards
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        
        <div className="text-center text-white-50 mt-4">
          <p>Showing {sortedAndFilteredUsers.length} of {users.length} community members</p>
        </div>
      </Container>
    </div>
  );
};

export default Community;