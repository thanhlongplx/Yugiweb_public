import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "animate.css";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: sessionStorage.getItem("userUsername") || "User",
      userCoin: sessionStorage.getItem("userCoin") || "0",
      userRole: sessionStorage.getItem("userRole") || "customer",
    };
  }

  componentDidMount() {
    this.updateUserInfo();
    this.interval = setInterval(() => {
      this.updateUserInfo();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateUserInfo = () => {
    const name = sessionStorage.getItem("userUsername");
    let coin = parseFloat(sessionStorage.getItem("userCoin")) || 0;
    coin = Math.round(coin * 100) / 100;

    this.setState({
      username: name || "User",
      userCoin: coin,
      userRole: sessionStorage.getItem("userRole") || "customer",
    });
  };

  formatNumber(num) {
    const roundedNum = (Math.round(num * 1000) / 1000).toFixed(1);
    const [integerPart, decimalPart] = roundedNum.split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger},${decimalPart}`;
  }

  render() {
    const { username, userCoin, userRole } = this.state;

    return (
      <nav className="  navbar navbar-expand-lg navbar-dark bg-black fixed-top">
        <div className="container p-0">
          <NavLink className="navbar-brand" to="/">
            <img
              width="120"
              src="/YugiCoin2.png"
              alt="YugiCoin Logo"
              className="animate__animated animate__flip me-2"
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
              {/* Customer Links */}

              <li className="nav-item">
                <NavLink className="nav-link" to="/Collection.html">
                  My Collection
                </NavLink>
              </li>
              {userRole === "customer" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/MiniGame.html">
                      MiniGame
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/FriendList.html">
                      Friends
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Community.html">
                      Community
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Contact.html">
                      Contact
                    </NavLink>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {userRole === "admin" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/CoinManager.html">
                      Coin Manager
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/FeedbackList.html">
                      Feedback List
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/AccountManager.html">
                      Account Manager
                    </NavLink>
                  </li>
                </>
              )}

              {/* User Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {sessionStorage.getItem("userRole") === null && (
                    <>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/RegisterForm.html"
                        >
                          Register
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/LoginForm.html">
                          Login
                        </NavLink>
                      </li>
                    </>
                  )}
                  {sessionStorage.getItem("userRole") && (
                    <li>
                      <NavLink className="dropdown-item" to="/LogoutForm.html">
                        Logout
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>

              {/* Buy Cards Dropdown */}
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdownCategories"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Buy Cards
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
                      Blue Eyes
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
                  <li>
                    <NavLink className="dropdown-item" to="/AllCards.html">
                      All Cards
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Coin Display */}
              <li className="nav-item d-flex align-items-center text-white">
                <img
                  src="/YugiCoin2.png"
                  alt="YugiCoin"
                  style={{ width: "30px", marginRight: "5px" }}
                />
                <span>: {this.formatNumber(userCoin)} YC</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
