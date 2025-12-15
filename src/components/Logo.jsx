import React from "react";
import logo from "../assets/logo (2).png";

const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <img className="h-20" src={logo} alt="" />
      <h3 className="text-3xl font-bold -ms-2">EliteDecor</h3>
    </div>
  );
};

export default Logo;
