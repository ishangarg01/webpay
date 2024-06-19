const express = require("express");
const cors = require("cors");
const app = express();
const { z } = require("zod");
const { router } = require("./routes/index");
app.use(express.json());

app.use(cors());
// app.get("/test", (req, res) => {
//   res.json({
//     message: "ok",
//   });
// });
// console.log(3);
app.use("/api/v1", router);

app.listen(3000);
