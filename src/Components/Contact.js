import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      message: "",
      files: [],
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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel .xlsx
      "application/vnd.ms-excel", // Excel .xls
    ];
  
    const isValid = files.every((file) => validFileTypes.includes(file.type));
    if (isValid) {
      this.setState({ files });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload valid files (JPEG, PNG, PDF, or Excel).",
      });
      e.target.value = "";
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message, files } = this.state;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("message", message);

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
          name: "",
          email: "",
          phone: "",
          message: "",
          files: [],
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

  render() {
    return (
      <div>
        <main className="flex-shrink-0">
          <section className="page-section bg-light" id="contact">
            <div className="container">
              <h2 className="page-section-heading text-center text-uppercase text-secondary mb-4">
                Contact Me
              </h2>
              <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                  <form
                    id="contactForm"
                    className="bg-white p-5 shadow rounded"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name..."
                        value={this.state.name}
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="name">Full Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="email">Email Address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={this.state.phone}
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="phone">Phone Number</label>
                    </div>
                    <div className="form-floating mb-3">
                      <textarea
                        className="form-control"
                        id="message"
                        placeholder="Enter your message here..."
                        style={{ height: "10rem" }}
                        value={this.state.message}
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="message">Message</label>
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        id="file"
                        onChange={this.handleFileChange}
                        multiple
                      />
                      <label htmlFor="file">Upload Files</label>
                    </div>
                    <button className="btn btn-primary btn-xl" type="submit">
                      Send
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
