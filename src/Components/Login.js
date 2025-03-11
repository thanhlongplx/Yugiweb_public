import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, provider, facebookProvider } from "./firebase"; // Import Firebase
import { signInWithPopup } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      passWord: "",
      error: "",
      loading: false,
    };
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { email, passWord } = this.state;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ email, passWord }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.setState({ error: errorData.error });
        return;
      }

      const data = await response.json();
      alert("Đăng nhập thành công");
      sessionStorage.setItem("userEmail", data.userEmail);
      sessionStorage.setItem("userCoin", data.userCoin);
      sessionStorage.setItem("userRole", data.userRole);
      this.props.navigate("/"); // Redirect to home
      this.setState({ email: "", passWord: "", error: "" });
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({
        error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
      });
    }
  };

  // handleFacebookLogIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, facebookProvider);
  //     const user = result.user;

  //     // Gửi thông tin người dùng đến server để tạo tài khoản
  //     const response = await fetch("http://localhost:5000/login-facebook", {
  //       method: "POST",
  //       body: JSON.stringify({ email: user.email, name: user.displayName }),
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert("Đăng nhập thành công bằng Facebook");
  //       sessionStorage.setItem("userEmail", data.userEmail);
  //       sessionStorage.setItem("userCoin", data.userCoin);
  //       sessionStorage.setItem("userRole", data.userRole);
  //       this.props.navigate("/"); // Redirect to home
  //     } else {
  //       this.setState({ error: data.error });
  //     }
  //   } catch (error) {
  //     console.error("Error during Facebook sign-in:", error);
  //     this.setState({ error: "Đã xảy ra lỗi khi đăng nhập bằng Facebook." });
  //   }
  // };

  handleLoginWithGoogle = async () => {
    this.setState({ loading: true, error: "" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Gửi thông tin người dùng đến backend để đăng ký hoặc đăng nhập
      const response = await fetch("http://localhost:5000/login-google", {
        method: "POST",
        body: JSON.stringify({ email: user.email, name: user.displayName }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Đăng nhập không thành công");
      }

      const data = await response.json();
      toast.info("Đăng nhập thành công bằng Google");
      sessionStorage.setItem("userEmail", data.userEmail);
      sessionStorage.setItem("userCoin", data.userCoin);
      sessionStorage.setItem("userRole", data.userRole);
      this.props.navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Error during Google login:", error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, passWord, error, loading } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={this.handleOnSubmit}
          className="p-4 border rounded shadow w-50 me-auto ms-auto"
        >
          <div className="form-group mb-3">
            <label htmlFor="email" className="font-weight-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Type your email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="passWord" className="font-weight-bold">
              Password
            </label>
            <input
              type="password"
              id="passWord"
              name="passWord"
              className="form-control"
              placeholder="Type your password"
              value={passWord}
              onChange={this.handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block me-auto ms-auto"
          >
            Login
            <i className="fas fa-arrow-right" style={{ marginLeft: "8px" }}></i>
          </button>
          <NavLink
            className="text-danger text-center btn-block me-auto ms-auto"
            to="/RegisterForm.html"
          >
            Register
          </NavLink>
        </form>

        <button
          onClick={this.handleLoginWithGoogle}
          className="btn btn-white text-black border-primary btn-block mt-3 w-25 me-auto ms-auto"
          disabled={loading}
        >
          <img
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            alt="Google Logo"
            style={{ width: "20px", marginRight: "8px" }}
          />
          Login With Google
        </button>
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
