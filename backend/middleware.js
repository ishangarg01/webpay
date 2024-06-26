const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader" + authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "not authorized.",
    });
  }
  const token = authHeader.split(" ")[1];
  // console.log(token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded);
    if (decoded.userId) {
      req.userId = decoded.userId;

      // console.log("auth");
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: "token is invalid. login" });
  }
};

module.exports = {
  authMiddleware,
};
