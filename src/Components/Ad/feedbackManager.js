import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const CARDS_API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [cardImageMap, setCardImageMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search and filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter(
        (feedback) =>
          feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.cardImageName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredFeedbacks(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, feedbacks]);

  const confirmDeleteFeedback = (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteModal(true);
  };

  const handleDeleteFeedback = useCallback(async () => {
    if (!feedbackToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/feedbacks/delete/${feedbackToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete feedback");
      }

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter(
          (feedback) => feedback._id !== feedbackToDelete._id
        )
      );
      toast.success("Feedback deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Error deleting feedback");
      setError(err.message || "Error deleting feedback");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
    }
  }, [feedbackToDelete]);

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const feedbackResponse = await axios.get(`${API_BASE_URL}/api/feedbacks`);
      setFeedbacks(feedbackResponse.data);
      setFilteredFeedbacks(feedbackResponse.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error fetching feedbacks";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCardImages = useCallback(async () => {
    try {
      // Check if we already have card images in local storage
      const cachedCardImages = localStorage.getItem("cardImageMap");
      if (cachedCardImages) {
        setCardImageMap(JSON.parse(cachedCardImages));
        return;
      }

      const cardResponse = await axios.get(CARDS_API_URL);
      const cardData = cardResponse.data.data;

      // Create a mapping of card names to image URLs
      const imageMap = {};
      cardData.forEach((card) => {
        if (card.card_images && card.card_images.length > 0) {
          imageMap[card.name] = card.card_images[0].image_url;
        }
      });

      setCardImageMap(imageMap);

      // Cache the card images for future use
      localStorage.setItem("cardImageMap", JSON.stringify(imageMap));
    } catch (err) {
      console.error("Error fetching card images:", err);
      // Don't show a toast for this as it's not critical
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
    fetchCardImages();
  }, [fetchFeedbacks, fetchCardImages]);

  const handleRefresh = () => {
    fetchFeedbacks();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => paginate(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4 mb-4">
        <Pagination.First
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container fluid className="py-4 bg-dark">
      <Card className="shadow container p-0">
        <Card.Header className=" text-white bg-dark">
          <Row className="align-items-center ">
            <Col>
              <h2 className="mb-0">Feedback Management</h2>
            </Col>
            <Col xs="auto">
              <Link to="/Admin.html" className="btn btn-light me-2">
                <i className="bi bi-arrow-left"></i> Back to Admin
              </Link>
              <Button
                variant="success"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-3">
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or feedback content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <Badge bg="primary" className="p-2">
                Total Feedback: {filteredFeedbacks.length}
              </Badge>
            </Col>
          </Row>

          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <Alert variant="info">
              No feedback found. {searchTerm && "Try a different search term."}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover bordered striped className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Feedback</th>
                      <th>Date</th>
                      <th>Files</th>
                      <th>Card Feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((feedback) => (
                      <tr key={feedback._id}>
                        <td>{feedback.name || "-"}</td>
                        <td>
                          {feedback.email ? (
                            <a href={`mailto:${feedback.email}`}>
                              {feedback.email}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{feedback.phone || "-"}</td>
                        <td>
                          <div
                            style={{ maxHeight: "100px", overflowY: "auto" }}
                          >
                            {feedback.message || "-"}
                          </div>
                        </td>
                        <td>
                          {feedback.date ? formatDate(feedback.date) : "-"}
                        </td>
                        <td>
                          {feedback.files && feedback.files.length > 0 ? (
                            <div className="d-flex flex-column gap-1">
                              {feedback.files.map((file, index) => (
                                <a
                                  key={index}
                                  href={`${API_BASE_URL}/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="bi bi-file-earmark"></i> File{" "}
                                  {index + 1}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <Badge bg="secondary">No files</Badge>
                          )}
                        </td>
                        <td className="text-center">
                          {cardImageMap[feedback.cardImageName] ? (
                            <Image
                              src={cardImageMap[feedback.cardImageName]}
                              alt={feedback.cardImageName}
                              thumbnail
                              style={{ maxWidth: "80px" }}
                              className="cursor-pointer"
                              title={feedback.cardImageName}
                            />
                          ) : (
                            <Badge bg="secondary">No card</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => confirmDeleteFeedback(feedback)}
                            className="w-100"
                          >
                            <i className="bi bi-trash"></i> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {renderPagination()}
            </>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Last updated: {new Date().toLocaleString()}</small>
        </Card.Footer>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this feedback from{" "}
            {feedbackToDelete?.name || "this user"}?
          </p>
          <p className="text-danger">
            <strong>This action cannot be undone!</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteFeedback}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FeedbackList;
