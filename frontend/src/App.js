import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import { Web3Provider } from "./web3 integrate/Web3Context";

function App() {
  return (
    <>
      <Web3Provider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signin />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </>
  );
}

export default App;
