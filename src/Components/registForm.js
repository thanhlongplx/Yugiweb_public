import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      passWord: "",
      confirmPassword: "",
      error: "",
    };
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, email, passWord, confirmPassword } = this.state;

    // Kiểm tra xác nhận mật khẩu
    if (passWord !== confirmPassword) {
      this.setState({ error: "Mật khẩu và xác nhận mật khẩu không khớp." });
      return;
    }

    // Gửi dữ liệu đến server
    let result = await fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify({ name, email, passWord }),
      headers: { "Content-Type": "application/json" },
    });
    result = await result.json();
    
    if (result.error) {
      this.setState({ error: result.error });
    } else {
      alert("Đăng ký thành công");
      this.setState({ name: "", email: "", passWord: "", confirmPassword: "", error: "" });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email, passWord, confirmPassword, error } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Đăng Ký Tài Khoản</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={this.handleOnSubmit} className="p-4 border rounded shadow">
          <div className="form-group mb-3">
            <label htmlFor="name" className="font-weight-bold">Tên</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email" className="font-weight-bold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="passWord" className="font-weight-bold">Mật khẩu</label>
            <input
              type="password"
              name="passWord"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={passWord}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="confirmPassword" className="font-weight-bold">Xác nhận Mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Đăng Ký</button>
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