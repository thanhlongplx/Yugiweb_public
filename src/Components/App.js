import React, { useState } from "react"; // Nhớ import useState
import "../CSS/App.css";
import Nav from "./Nav";
import Home from "./Home";
import Footer from "./Footer";
import BlueEyes from "./Cards/BlueEyes";
import Header from "./Header";
import Contact from "./Contact";
import DieuHuongURL from "../routers/DieuHuongURL";

function App() {
  return (
    <div>
      <DieuHuongURL />
      <Footer />
    </div>
  );
}

export default App;
