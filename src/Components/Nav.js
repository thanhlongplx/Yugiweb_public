import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: sessionStorage.getItem("userEmail") || "User",
      userCoin: sessionStorage.getItem("userCoin") || "YC",
    };
  }

  componentDidMount() {
    // Cập nhật username khi component mount
    this.updateUsername();
    this.updateUserCoin();

    // Kiểm tra thường xuyên
    this.interval = setInterval(this.updateUsername, 1000);
    this.interval = setInterval(this.updateUserCoin, 1000);
  }

  componentWillUnmount() {
    // Dọn dẹp interval khi component bị hủy
    clearInterval(this.interval);
  }

  updateUsername = () => {
    const email = sessionStorage.getItem("userEmail");
    if (email !== this.state.username) {
      this.setState({ username: email || "User" });
    }
  };
  updateUserCoin = () => {
    const coin = sessionStorage.getItem("userCoin");
    if (coin !== this.state.userCoin) {
      this.setState({ userCoin: coin || "$" });
    }
  };

  render() {
    const { username, userCoin } = this.state;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container px-5">
          <NavLink className="navbar-brand" to="/">
            <img
              width="120"
              src="/YugiCoin.png"
              alt="YugiCoin Logo"
              className="me-2"
            />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/Collection.html">
                  My collection
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/MiniGame.html">
                  MiniGame
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Contact.html">
                  Contact
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {username}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/RegisterForm.html">
                      Register
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/LoginForm.html">
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/LogoutForm.html">
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdownCategories"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </NavLink>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownCategories"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/WaterCards.html">
                      Water
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/BlueEyes.html">
                      Blue eyes
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/DarkAttributeMonsters.html"
                    >
                      Dark Attribute Monsters
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center text-white bg-dark">
                <div className="d-flex align-items-center">
                  <img
                    src="/YugiCoin.png"
                    alt="YugiCoin"
                    style={{ width: "30px", marginLeft: "0px" }}
                  />
                </div>
                <span>: {userCoin}YC</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
