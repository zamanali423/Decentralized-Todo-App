import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        } catch (error) {
          console.error("Error initializing Web3:", error);
        }
      } else {
        console.error("Ethereum provider not found. Please install MetaMask.");
      }
    };

    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (!web3) return;

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const signMessage = async (nonce) => {
    if (!web3 || !account) return;

    const message = `Sign this message to log in: ${nonce}`;
    try {
      const signature = await web3.eth.personal.sign(message, account);
      return signature;
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ web3, account, connectWallet, signMessage }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
