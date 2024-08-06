import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Signin = () => {
  const { setToken } = useContext(userContext);
  const [inputFields, setinputFields] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setinputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchData = await fetch(
        "http://localhost:3001/auth/users/register/newUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputFields),
        }
      );
      const data = await fetchData.json();
      console.log(data);
      if (!fetchData.ok) {
        toast.error(data.msg);
      }
      const token = data.user.tokens[0].token;
      setToken(token);
      localStorage.setItem("token", token);
      navigate("/");
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mainForm">
      <div className="container3">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="fullName"
              value={inputFields.fullName}
              onChange={handleInput}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={inputFields.email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={inputFields.password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={inputFields.confirmPassword}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
