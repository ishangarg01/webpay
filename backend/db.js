const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ishangarg0101:khDmFN450PcyDoNy@cluster0.0jjx2rl.mongodb.net/"
);

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Account = new mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
