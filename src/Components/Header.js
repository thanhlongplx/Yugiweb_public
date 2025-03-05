import React, { Component } from "react";
import Nav from "./Css/Nav.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <header className="py-5 position-relative border-5">
        <div className="left-header-background"></div>
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center">
            <div className="col-lg-8 col-xl-7 col-xxl-6">
              <div className="my-5 text-center text-xl-start">
                <h1 className="display-5 fw-bolder text-white mb-2">
                  Welcome to the World of Yu-Gi-Oh!
                </h1>
                <p className="lead fw-normal text-white-50 mb-4">
                  Dive into the exciting universe of Yu-Gi-Oh!, where strategy
                  meets fantasy. Build your deck, challenge opponents, and
                  become the ultimate duelist!
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                  <Link
                    className="btn btn-warning btn-lg px-4 me-sm-3"
                    to="/BlueEyes.html"
                  >
                    Start your journey
                  </Link>
                  <Link
                    className="btn btn-outline-dark text-white btn-lg px-4"
                    to="/Contact.html"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
              <img
                className="img-fluid rounded-3 my-5"
                src="https://static.fado.vn/uploads/news/2018/03/05/Fado.VN_1520222875.1515.jpg"
                alt="Yu-Gi-Oh!"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export default Header;
