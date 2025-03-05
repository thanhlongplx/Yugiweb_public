import React, { Component } from "react";
import Swal from "sweetalert2";
import { useParams, Link } from "react-router-dom";

class Contact extends Component {
  render() {
    const showAlert = () => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    };
    return (
      <div>
        <>
          <meta charSet="utf-8" />

          <title>Contact</title>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root" />
          {/* Contentcopy */}
          <main className="flex-shrink-0">
            {/* Navigation*/}

            {/* Header*/}
           
            {/* contact start */}
            <section className="page-section bg-light" id="contact">
              <div className="container">
                <h2 className="page-section-heading text-center text-uppercase text-secondary mb-4">
                  Contact Me
                </h2>
                <div className="divider-custom">
                  <div className="divider-custom-line" />
                  <div className="divider-custom-icon">
                    <i className="fas fa-envelope" />
                  </div>
                  <div className="divider-custom-line" />
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xl-7">
                    <form
                      id="contactForm"
                      data-sb-form-api-token="API_TOKEN"
                      className="bg-white p-5 shadow rounded"
                    >
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="name"
                          type="text"
                          placeholder="Enter your name..."
                          data-sb-validations="required"
                          data-sb-can-submit="no"
                        />
                        <label htmlFor="name">Full name</label>
                        <div
                          className="invalid-feedback"
                          data-sb-feedback="name:required"
                        >
                          A name is required.
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          data-sb-validations="required,email"
                          data-sb-can-submit="no"
                        />
                        <label htmlFor="email">Email address</label>
                        <div
                          className="invalid-feedback"
                          data-sb-feedback="email:required"
                        >
                          An email is required.
                        </div>
                        <div
                          className="invalid-feedback"
                          data-sb-feedback="email:email"
                        >
                          Email is not valid.
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="phone"
                          type="tel"
                          placeholder="(123) 456-7890"
                          data-sb-validations="required"
                          data-sb-can-submit="no"
                        />
                        <label htmlFor="phone">Phone number</label>
                        <div
                          className="invalid-feedback"
                          data-sb-feedback="phone:required"
                        >
                          A phone number is required.
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="message"
                          placeholder="Enter your message here..."
                          style={{ height: "10rem" }}
                          data-sb-validations="required"
                          data-sb-can-submit="no"
                          defaultValue={""}
                        />
                        <label htmlFor="message">Message</label>
                        <div
                          className="invalid-feedback"
                          data-sb-feedback="message:required"
                        >
                          A message is required.
                        </div>
                      </div>
                      <div className="d-none" id="submitSuccessMessage">
                        <div className="text-center mb-3">
                          <div className="fw-bolder">
                            Form submission successful!
                          </div>
                          To activate this form, sign up at
                          <br />
                          <a href="https://startbootstrap.com/solution/contact-forms">
                            https://startbootstrap.com/solution/contact-forms
                          </a>
                        </div>
                      </div>
                      <div className="d-none" id="submitErrorMessage">
                        <div className="text-center text-danger mb-3">
                          Error sending message!
                        </div>
                      </div>
                      <a
                        onClick={showAlert}
                        className="btn btn-primary btn-xl"
                        id="submitButton"
                        type="submit"
                      >
                        Send
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* contact start end*/}

            {/* Contentcopy end*/}
          </main>
        </>
      </div>
    );
  }
}
export default Contact;
