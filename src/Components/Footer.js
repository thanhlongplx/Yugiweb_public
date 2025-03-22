import React, { Component } from "react";
import "./Css/Nav.css";

class Footer extends Component {
  render() {
    return (
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <span className="me-2">
                  <i className="bi bi-code-square fs-4"></i>
                </span>
                <div>
                  <h5 className="mb-0">YugiWeb</h5>
                  <p className="small mb-0">
                    Copyright © YugiWeb {new Date().getFullYear()} by Le Thanh Long
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <ul className="nav justify-content-md-end justify-content-center">
                <li className="nav-item">
                  <a className="nav-link text-white-50 hover-light" href="#!">
                    <i className="bi bi-shield-lock me-1"></i>Privacy
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white-50 hover-light" href="#!">
                    <i className="bi bi-file-text me-1"></i>Terms
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white-50 hover-light" href="#!">
                    <i className="bi bi-envelope me-1"></i>Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;