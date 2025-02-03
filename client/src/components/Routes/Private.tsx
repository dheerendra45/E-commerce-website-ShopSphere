import { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState<boolean | null>(null); // Track if user is authenticated
  const [auth] = useAuth(); // Authentication context

  useEffect(() => {
    const authCheck = async () => {
      if (!auth?.token) {
        setOk(false); // No token means not authenticated
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        // If response is successful and user is authenticated
        setOk(res.data.ok);
      } catch (error) {
        console.error("Auth check error:", error);
        setOk(false); // On error, set as not authenticated
      }
    };

    if (auth?.token && ok === null) {
      authCheck(); // Only check if there's a token and no result yet
    } else if (!auth?.token) {
      setOk(false); // If no token, directly set as not authenticated
    }
  }, [auth?.token, ok]);

  if (auth?.token && ok === null) {
    return <Spinner />; // Show spinner until auth check is completed
  }

  // If user is not authenticated, navigate to login
  if (ok === true) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the requested route
  return <Outlet />;
}
