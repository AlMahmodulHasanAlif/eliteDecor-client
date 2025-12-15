import React from "react";

const Spinner = ({ size = "w-16 h-16", color = "border-blue-500" }) => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color} ${size}`}
      ></div>
    </div>
  );
};

export default Spinner;
