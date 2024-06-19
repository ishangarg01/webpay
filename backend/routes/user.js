const exress = require("express");
const userRouter = exress.Router();
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const z = require("zod");

const signupSchema = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

userRouter.post("/signup", async (req, res) => {
  // console.log(1);
  const body = req.body;

  if (!signupSchema.safeParse(body).success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create(body);

  await Account.create({
    userId: user._id,
    balance: Math.floor(Math.random() * 10000) + 1,
  });

  const payload = { userId: user._id };

  const token = jwt.sign(payload, JWT_SECRET);

  // console.log(jwt.verify(token, JWT_SECRET));

  return res.status(200).json({
    message: "user created successfully",
    token: token,
  });
});

const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

userRouter.post("/signin", async (req, res) => {
  const body = req.body;

  if (!signinBody.safeParse(body).success) {
    return res.status(411).json({
      message: "Incorrect inputs...",
    });
  }

  const existingUser = await User.findOne(body);
  if (!existingUser) {
    return res.status(411).json({
      message: "User doesn't exist. Pls signup.",
    });
  }

  const token = jwt.sign(
    {
      userId: existingUser._id,
    },
    JWT_SECRET
  );
  const decoded = jwt.verify(token, JWT_SECRET);
  // console.log(decoded);

  return res.status(200).json({
    token,
  });
});

const updateSchema = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  if (!updateSchema.safeParse(req.body).success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);
  // console.log(req);

  res.json({
    message: "updated successfully",
  });
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || ""; // "" returns everything
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    users: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = {
  userRouter,
};
