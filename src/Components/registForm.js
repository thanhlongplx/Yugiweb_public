import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      passWord: "",
      confirmPassword: "",
      error: "",
    };
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, username, passWord, confirmPassword } = this.state;

    // Kiểm tra xác nhận mật khẩu
    if (passWord !== confirmPassword) {
      this.setState({ error: "Mật khẩu và xác nhận mật khẩu không khớp." });
      return;
    }

    // Gửi dữ liệu đến server
    let result = await fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify({ name, username, passWord }), // Gửi dữ liệu đăng ký
      headers: { "Content-Type": "application/json" },
    });

    result = await result.json();

    if (result.error) {
      this.setState({ error: result.error });
    } else {
      alert("Đăng ký thành công");
      this.setState({
        name: "",
        username: "",
        passWord: "",
        confirmPassword: "",
        error: "",
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, username, passWord, confirmPassword, error } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Register</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={this.handleOnSubmit}
          className="p-4 border rounded shadow w-50 me-auto ms-auto"
        >
          <div className="form-group mb-3">
            <label htmlFor="name" className="font-weight-bold">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Type your name"
              value={name}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="username" className="font-weight-bold">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Type your username"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="passWord" className="font-weight-bold">
              Password
            </label>
            <input
              type="password"
              name="passWord"
              className="form-control"
              placeholder="Type your password"
              value={passWord}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="confirmPassword" className="font-weight-bold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Type your password again"
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-danger btn-block me-auto ms-auto"
          >
            Register
          </button>

          <NavLink
            className="text-primary text-center btn-block me-auto ms-auto"
            to="/LoginForm.html"
          >
            Login
          </NavLink>
        </form>
      </div>
    );
  }
}

// Wrap Register component with useNavigate
const RegisterWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Register {...props} navigate={navigate} />;
};

export default RegisterWithNavigate;
