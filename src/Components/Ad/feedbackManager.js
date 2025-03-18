import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("You want to delete this feedback?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/feedbacks/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete feedback");
        }

        // Cập nhật lại danh sách feedbacks
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((feedback) => feedback._id !== id)
        );
        toast.success("Delete feedback successfully!");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedbacks");
        setFeedbacks(response.data);
      } catch (err) {
        setError("Error fetching feedbacks");
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Feedback List</h2>
      <div className="mb-3">
        <Link to="/Admin.html" className="btn btn-primary me-2">
          Quay lại
        </Link>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered" style={{ marginBottom: "10%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Number Phone</th>
            <th>Feedback</th>
            <th>Date</th>
            <th>Files</th>
            <th>Actions</th> {/* Thêm cột cho hành động */}
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback._id}>
              <td>{feedback.name}</td>
              <td>{feedback.email}</td>
              <td>{feedback.phone}</td>
              <td>{feedback.message}</td>
              <td>{new Date(feedback.date).toLocaleString()}</td>
              <td>
                {feedback.files.length > 0 ? (
                  feedback.files.map((file, index) => (
                    <a
                      key={index}
                      href={`http://localhost:5000/${file}`} // Đường dẫn đến tệp
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link"
                    >
                      File {index + 1}
                    </a>
                  ))
                ) : (
                  <span>No files</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteFeedback(feedback._id)} // Gọi hàm xóa
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;