import React from "react";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>This is the Guest Layout Page</h1>
      <Outlet /> {/* Các tuyến đường lồng nhau sẽ hiển thị ở đây */}
    </div>
  );
};

export default GuestLayout;
