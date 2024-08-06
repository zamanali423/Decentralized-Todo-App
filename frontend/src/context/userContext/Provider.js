import React, { useEffect, useState } from "react";
import { userContext } from "./userContext";

const Provider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const isLogin = !!token;

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const fetchUser = await fetch("http://localhost:3001/auth/users/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await fetchUser.json();
        setUser(data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    if (token) {
      getUser();
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <userContext.Provider value={{ user, token, setToken, isLogin, logout }}>
      {children}
    </userContext.Provider>
  );
};

export default Provider;
