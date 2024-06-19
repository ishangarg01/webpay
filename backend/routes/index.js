const express = require("express");
const app = express();
const router = express.Router();
const { userRouter } = require("./user");
const { accountRouter } = require("./account");

console.log(2);

// router.get("/test", (req, res) => {
//   res.json({
//     message: "ok",
//   });
// });

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = {
  router,
};
