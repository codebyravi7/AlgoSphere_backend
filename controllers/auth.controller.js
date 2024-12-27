import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, gender } = req.body;
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: true, message: "email already exists" });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?email=${email}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?email=${email}`;

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (user) {
      // Generate JWT token here
      const token = generateTokenAndSetCookie(user._id, res);
      await user.save();
      console.log("not coomiing here");

      res.status(201).json({
        user,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Trying to login in backend", email, password);

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development",
      path: "/", // Ensure this matches the original path
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
