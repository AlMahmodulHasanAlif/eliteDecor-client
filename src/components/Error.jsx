import React from "react";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[8rem] font-bold mb-6 tracking-widest">404</h1>
        <h2 className="text-3xl mb-4 font-light">Page Not Found</h2>
        <p className="mb-8">
          Oops! The page you are looking for does not exist. 
          Return to the homepage to continue exploring Elite Decor.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 border-2 border-white font-bold transition-colors duration-300 hover:bg-white hover:text-black"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
