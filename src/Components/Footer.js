import React, { Component } from "react";
import Nav from "./Css/Nav.css";
class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="bg-dark py-4 mb-0">
          <div className="container px-5">
            <div className="row align-items-center justify-content-between flex-column flex-sm-row">
              <div className="col-auto">
                <div className="small m-0 text-white">
                  Copyright © Your Website 2023
                </div>
              </div>
              <div className="col-auto">
                <a className="link-light small" href="#!">
                  Privacy
                </a>
                <span className="text-white mx-1">·</span>
                <a className="link-light small" href="#!">
                  Terms
                </a>
                <span className="text-white mx-1">·</span>
                <a className="link-light small" href="#!">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
export default Footer;
