import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      passWord: "",
      error: "",
      coin: 0,
    };
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { email, passWord } = this.state;
  
    try {
      let result = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ email, passWord }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!result.ok) {
        const errorData = await result.json();
        this.setState({ error: errorData.error });
        return;
      }
  
      const data = await result.json();
      alert("Đăng nhập thành công");
      sessionStorage.setItem("userEmail", data.userEmail); // Lưu email vào sessionStorage
      sessionStorage.setItem("userCoin", data.userCoin); // Lưu coin vào sessionStorage
      console.log("User email saved:", data.userEmail);
      
  
      // Log ra số coin ngay sau khi đã lưu
      const userCoin = sessionStorage.getItem("userCoin");
      console.log("User coin retrieved from sessionStorage:", userCoin); // Log giá trị coin đã lưu
  
      this.props.navigate("/");
      this.setState({ email: "", passWord: "", error: "" });
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({
        error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, passWord, error } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Đăng Nhập</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={this.handleOnSubmit}
          className="p-4 border rounded shadow"
        >
          <div className="form-group mb-3">
            <label htmlFor="email" className="font-weight-bold">
              Email
            </label>
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
          <div className="form-group mb-4">
            <label htmlFor="passWord" className="font-weight-bold">
              Mật khẩu
            </label>
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
          <button type="submit" className="btn btn-primary btn-block">
            Đăng Nhập
          </button>
        </form>
      </div>
    );
  }
}

// Wrap Login component with useNavigate
const LoginWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

export default LoginWithNavigate;
