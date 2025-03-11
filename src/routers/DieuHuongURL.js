import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "../Components/Ad/Admin.js";
import Home from "../Components/Home";
import BlueEyes from "../Components/Cards/BlueEyes";
import Detail from "../Components/Detail";
import Contact from "../Components/Contact";
import Nav from "../Components/Nav";
import RegistForm from "../Components/registForm.js"; // Đảm bảo bạn nhập đúng đường dẫn
import Login from "../Components/Login";
import Logout from "../Components/Logout";
import WaterCards from "../Components/Cards/WaterCards";
import DarkAttributeMonsters from "../Components/Cards/DarkAttributeMonsters";
import AllCards from "../Components/Cards/AllCards";
import Header from "../Components/Header";
import MiniGame from "../Components/MiniGame";
import Collection from "../Components/Collection";
import CoinManager from "../Components/Ad/CoinManager.js";
import AccountManager from "../Components/Ad/AccountManager.js";
import Community from "../Components/Community/community.js";
import UserDetail from "../Components/Community/UserDetail.js";

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
            <Route path="/LoginForm.html" element={<Login />} />
            <Route path="/LogoutForm.html" element={<Logout />} />
            <Route path="/Admin.html" element={<Admin />} />
            <Route path="/WaterCards.html" element={<WaterCards />} />
            <Route path="/AllCards.html" element={<AllCards />} />
            <Route path="/MiniGame.html" element={<MiniGame />} />
            <Route path="/Collection.html" element={<Collection />} />
            <Route path="/AccountManager.html" element={<AccountManager />} />
            <Route path="/Community.html" element={<Community />} />
            <Route path="/user/:email" element={<UserDetail />} />
            <Route path="/DarkAttributeMonsters.html" element={<DarkAttributeMonsters />} />
            <Route path="/CoinManager.html" element={<CoinManager />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default DieuHuongURL;