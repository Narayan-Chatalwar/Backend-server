const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route post /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username, !email, !password)) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({ message: "User already registered" });
    } else {
      //   Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      user.save();
      res.status(200).json({ message: "User created successfully !" });
    }
  } catch (err) {
    res.status(404).json({ message: "Server Error", error: err.message });
  }
});

//@desc login a user
//@route post /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const accessToken = jwt.sign(
          {
            user: {
              username: user.username,
              email: user.email,
              id: user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );

        res.json({ accessToken:accessToken });
      } else {
        res.json({ message: "password not valid" });
      }
      return res.status(200).json({ message: "user found with this email" });
    } else {
      return res
        .status(200)
        .json({ message: "user not found with this email" });
    }

    
  } catch (err) {
    res.status(405).json({ message: "Server Error" });
  }
});

//@desc get current user
//@route post /api/users/current
//@access public

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
