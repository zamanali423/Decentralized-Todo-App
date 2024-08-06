const express = require("express");
const router = express.Router();
const User = require("../../database/users/usersData");
const bcrypt = require("bcryptjs");
const {
  registerSchema,
  loginSchema,
} = require("../../validation/validatation");
const validate = require("../../middleware/validate");
const verifyToken = require("../../middleware/verifyToken");
const generateToken = require("../../authentication/generateToken");

router.get("/", (req, res) => {
  res.send("get user here");
});

//! Register User
router.post("/register/newUser", validate(registerSchema), async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email Already Registered" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      fullName,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = generateToken(user);
    return res.status(201).json({ msg: "Register Successfully", user, token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//! Login User
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email or password is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }
    const token = generateToken(user);
    return res.status(200).json({ msg: "Login Successfully", user, token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//! Crypto wallet
router.post("/wallet-login", async (req, res) => {
  const { address, signature, nonce } = req.body;

  if (!address || !signature || !nonce) {
    return res.status(400).json({ msg: "Missing required parameters" });
  }

  try {
    // Find the user by address
    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        fullName: 'Anonymous', // or prompt user for full name later
        walletAddress: address,
        email: `${address}@example.com`, // placeholder email
        password: "", // No password needed for wallet login
        nonce: Math.floor(Math.random() * 1000000) // Set initial nonce
      });
      await user.save();
    }

    // Validate the nonce
    if (user.nonce !== nonce) {
      return res.status(400).json({ msg: "Invalid nonce" });
    }

    // Verify the signature
    const web3 = new Web3();
    const message = `Sign this message to log in: ${nonce}`;
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    // Reset the nonce for security reasons
    user.nonce = Math.floor(Math.random() * 1000000);
    await user.save();

    // Generate a token
    const token = generateToken(user);

    res.status(200).json({ msg: "Login Successfully", user, token });
  } catch (error) {
    console.error("Error during wallet login:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

module.exports = router;


//! get user
router.get("/getUser", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: "User not find" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

module.exports = router;
