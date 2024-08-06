import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useWeb3 } from "../web3 integrate/Web3Context";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(userContext);
  const { connectWallet, account, signMessage } = useWeb3();
  const [inputFields, setinputFields] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (account) {
      handleWalletLogin();
    }
  }, [account]);

  const handleInput = (e) => {
    setinputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchData = await fetch("http://localhost:3001/auth/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputFields),
      });
      const data = await fetchData.json();
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

  const handleWalletLogin = async () => {
    try {
      // Request nonce from server
      const nonceResponse = await fetch("http://localhost:3001/auth/users/wallet-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: account }),
      });
      const nonceData = await nonceResponse.json();

      if (!nonceResponse.ok) {
        toast.error(nonceData.msg);
        return;
      }

      const { nonce } = nonceData;

      // Sign the nonce
      const signature = await signMessage(nonce);
      
      // Verify the signed message with the server
      const loginResponse = await fetch("http://localhost:3001/auth/users/wallet-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: account, signature, nonce }),
      });
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        toast.error(loginData.msg);
        return;
      }

      const token = loginData.token;
      setToken(token);
      localStorage.setItem("token", token);
      navigate("/");
      toast.success(loginData.msg);
    } catch (error) {
      console.error("Error logging in with wallet:", error);
    }
  };

  return (
    <div className="mainForm">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          <div className="form-group">
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
          <button type="submit">Login</button>
        </form>
        {!account ? (
          <button onClick={connectWallet}>Login with Crypto Wallet</button>
        ) : (
          <div>
            <p>Connected account: {account}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
