import { Navigate } from "react-router-dom";

function AuthCheck() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/ride/create" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default AuthCheck;
