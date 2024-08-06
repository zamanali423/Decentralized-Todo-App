const jwt = require("jsonwebtoken");
const User = require("../database/users/usersData");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: "Unauthorized User" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decoded = jwt.decode(token);
      const user = await User.findById(decoded.id);
      if (user) {
        user.tokens = user.tokens.filter((t) => t.token !== token);
        await user.save();
      }
      return res
        .status(401)
        .json({ msg: "Token Expired. Please log in again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: "Invalid Token" });
    }
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = verifyToken;
