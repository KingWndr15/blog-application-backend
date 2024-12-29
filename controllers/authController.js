const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Validation schemas
const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use." });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Login successful.", token });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
