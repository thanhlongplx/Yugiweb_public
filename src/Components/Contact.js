import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Css/Contact.css";
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: sessionStorage.getItem("userUsername"),
      email: "",
      phone: "",
      message: "",
      files: [],
      structuredFiles: [],
      cardImageName: "", // New state for the card image name
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFileTypes = [
      "image/jpeg",
      "image/png",

      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/plain", // Add support for .txt files
    ];

    const isValid = files.every((file) => validFileTypes.includes(file.type));
    if (isValid) {
      this.setState({ files });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload valid files (JPEG, PNG, PDF, Excel, or TXT).",
      });
      e.target.value = ""; // Reset the input
    }
  };

  handleStructuredFileChange = (e) => {
    const files = Array.from(e.target.files);
    this.setState({ structuredFiles: files });
  };

  handleSubmitNormal = async (e) => {
    e.preventDefault();
    const { username, email, phone, message, files, cardImageName } =
      this.state;

    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("message", message);
    formData.append("cardImageName", cardImageName); // Add card image name
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/feedbacks",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Feedback sent successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        this.setState({
          username: sessionStorage.getItem("userUsername"),
          email: sessionStorage.getItem("userEmail"),
          phone: "",
          message: "",
          files: [],
          cardImageName: "", // Reset card image name
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  handleSubmitStructured = async (e) => {
    e.preventDefault();
    const { structuredFiles } = this.state;

    if (structuredFiles.length > 0) {
      const textFile = structuredFiles.find((f) => f.type === "text/plain");
      if (textFile) {
        const text = await textFile.text(); // Read the content of the text file
        const [name, email, phone, message, cardImageName] = text.split("|");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("message", message);
        formData.append("cardImageName", cardImageName); // Set card image name

        // Append other files (images, etc.)
        structuredFiles.forEach((file) => {
          if (file.type !== "text/plain") {
            formData.append("files", file);
          }
        });

        try {
          const response = await axios.post(
            "http://localhost:5000/api/feedbacks",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (response.status === 201) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Feedback sent successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
            this.setState({ structuredFiles: [], cardImageName: "" }); // Reset structured files and image name
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please upload a structured file (.txt).",
        });
      }
    }
  };

  render() {
    return (
      <div className="bg-dark">
        <main className="flex-shrink-0">
          <section className="page-section" id="contact">
            <div className="">
              <h2 className="page-section-heading text-center text-uppercase text-white ">
                Contact Us
              </h2>
              <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                  {/* Normal Feedback Form */}
                  <form
                    id="normalContactForm"
                    className="contactForm bg-dark text-white p-5  border-5 rounded mb-4"
                    onSubmit={this.handleSubmitNormal}
                  >
                    <h5>Send Normal Feedback</h5>
                    <div className="mb-3">
                      <label htmlFor="name">User Name</label>

                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name..."
                        value={this.state.username}
                        onChange={this.handleChange}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email">Email Address</label>

                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        className="form-control"
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={this.state.phone}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        placeholder="Enter your message here..."
                        style={{ height: "10rem" }}
                        value={this.state.message}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="cardImageName">Card Name</label>
                      <input
                        className="form-control"
                        id="cardImageName"
                        type="text"
                        placeholder="Card Name"
                        value={this.state.cardImageName}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="file">Upload Files</label>
                      <input
                        type="file"
                        className="form-control"
                        id="file"
                        onChange={this.handleFileChange}
                        multiple
                      />
                    </div>
                    <button className="btn btn-primary btn-xl" type="submit">
                      Send
                    </button>
                  </form>

                  {/* Structured Feedback Form */}
                  <form
                    id="structuredContactForm"
                    className="contactForm bg-dark text-white p-5 shadow rounded"
                    onSubmit={this.handleSubmitStructured}
                  >
                    <h5>Send Structured Feedback</h5>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        id="structuredFile"
                        onChange={this.handleStructuredFileChange}
                        accept=".txt" // Only accept .txt files
                      />
                      <label htmlFor="structuredFile">
                        Upload Structured File
                      </label>
                    </div>
                    <button className="btn btn-primary btn-xl" type="submit">
                      Send Structured Feedback
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default Contact;
