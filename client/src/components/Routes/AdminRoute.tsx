import { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      if (!auth?.token) {
        setOk(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/v1/auth/admin-auth", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const isAdmin = Boolean(res.data?.ok && res.data?.user?.role === 1);
        setOk(isAdmin);

      } catch (error) {
        console.error("Auth check error:", error);
        setOk(false);
      }
    };

    // Only run authCheck if token is available and ok state is not yet determined
    if (auth?.token && ok === null) {
      authCheck();
    } else if (!auth?.token) {
      setOk(false);
    }

  }, [auth?.token, ok]);

  if (auth?.token && ok === null) {
    return <Spinner path="" />;
  }

  if (ok) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
