import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "../Components/Admin";
import Home from "../Components/Home";
import BlueEyes from "../Components/Cards/BlueEyes";
import Detail from "../Components/Detail";
import Contact from "../Components/Contact";
import Nav from "../Components/Nav";
import RegistForm from "../Components/registForm.js"; // Đảm bảo bạn nhập đúng đường dẫn
import WaterCards from "../Components/Cards/WaterCards";
import DarkAttributeMonsters from "../Components/Cards/DarkAttributeMonsters";
import Header from "../Components/Header";
import MiniGame from "../Components/MiniGame";

class DieuHuongURL extends Component {
  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/BlueEyes.html" element={<BlueEyes />} />
            <Route path="/chi-tiet/:slug/:id.html" element={<Detail />} />
            <Route path="/Contact.html" element={<Contact />} />
            <Route path="/RegisterForm.html" element={<RegistForm />} />
  <Route path="/LoginForm.html" element={<LoginForm />} />
            <Route path="/Admin.html" element={<Admin />} />
            <Route path="/WaterCards.html" element={<WaterCards />} />
            <Route path="/MiniGame.html" element={<MiniGame />} />
            <Route
              path="/DarkAttributeMonsters.html"
              element={<DarkAttributeMonsters />}
            />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default DieuHuongURL;
