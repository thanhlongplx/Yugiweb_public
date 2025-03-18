import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, provider } from "./firebase"; // Import Firebase
import { signInWithPopup } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      passWord: "",
      error: "",
      loading: false,
    };
  }

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { username, passWord } = this.state;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ username, passWord }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.setState({ error: errorData.error });
        return;
      }

      const data = await response.json();
      toast.success("Đăng nhập thành công");
      sessionStorage.setItem("userUsername", data.userUsername);
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("userCoin", data.userCoin);
      sessionStorage.setItem("userRole", data.userRole);
      this.props.navigate("/"); // Redirect to home
      this.setState({ username: "", passWord: "", error: "" });
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({
        error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
      });
    }
  };

  handleLoginWithGoogle = async () => {
    this.setState({ loading: true, error: "" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch("http://localhost:5000/login-google", {
        method: "POST",
        body: JSON.stringify({ email: user.email, name: user.displayName }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      toast.info("Login with Google successfully");
      sessionStorage.setItem("userUsername", data.userUsername);
      sessionStorage.setItem("username", data.name);
      sessionStorage.setItem("userCoin", data.userCoin);
      sessionStorage.setItem("userRole", data.userRole);
      this.props.navigate("/"); // Redirect to home

      // Check user role and redirect if admin
      if (data.userRole === "admin") {
        this.props.navigate("/Admin.html"); // Redirect to admin dashboard
      }

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
    const { username, passWord, error, loading } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form
          onSubmit={this.handleOnSubmit}
          className="p-4 border rounded shadow w-50 me-auto ms-auto"
        >
          <div className="form-group mb-3">
            <label htmlFor="username" className="font-weight-bold">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="passWord" className="font-weight-bold">Password</label>
            <input
              type="password"
              id="passWord"
              name="passWord"
              className="form-control"
              value={passWord}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
          <NavLink className="text-danger text-center btn-block me-auto ms-auto" to="/RegisterForm.html">
            Register
          </NavLink>
        </form>
        <button
          onClick={this.handleLoginWithGoogle}
          className="btn btn-light border-primary btn-block mt-3 w-50 me-auto ms-auto"
          disabled={loading}
          style={{ marginBottom: "100px" }}
        >
          <img
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            alt="Google Logo"
            style={{ width: "20px", marginRight: "8px" }}
          />
          Login with Google
        </button>
        <ToastContainer />
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