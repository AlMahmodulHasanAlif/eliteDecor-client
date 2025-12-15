import React from "react";
import { AuthContext } from "../context/AuthContext";
import { use } from "react";

const useAuth = () => {
  const authInfo = use(AuthContext);
  return authInfo;
};

export default useAuth;
