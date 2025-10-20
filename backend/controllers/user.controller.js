import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { sendEmail } from "../utils/sendEmail.js";


const SECRET = process.env.SECRET
export const registerUser = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    console.log("Incoming Register Request:", req.body);

    // 🔹 Validate input
    if (!username || !password || !email) {
      return res.status(400).send({ success: false, message: "Required field is missing" });
    }

    email = email.toLowerCase();

    // 🔹 Check if user already exists
    const isUserRegistered = await User.findOne({ email });
    if (isUserRegistered) {
      return res.status(409).send({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 🔹 Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 🔹 Create and save new user
    const newUser = new User({
      username,
      email,
      password: hash,
    });

    await newUser.save();

    // 🔹 Response
    return res.status(201).send({
      success: true,
      message: "User successfully registered",
    });

  } catch (error) {
    console.error("registerUserError:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  let { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({ success: false, message: "Required parameter is missing" })
  }

  try {
    email = email.toLowerCase()
    const existUser = await User.findOne({ email })
    if (!existUser) {
      return res.status(400).send({ success: false, message: "User does not exist with this email" })
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Password is incorrect" })
    }

    const payload = { userId: existUser._id, email: existUser.email, username: existUser.username, }
    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" })

    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 86400000,
       // 1 day
         httpOnly: true,
      secure: true,        // since Vercel serves HTTPS
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: payload,
      token, // send it back too (optional if you only want cookie auth)
    })
  } catch (error) {
    console.log("error", error)
    res.status(500).send({ success: false, message: "Internal server error" })
  }
}

    //logout
 export const logoutUser = (req, res) => {
  try {
    res.clearCookie("Token",{
  httpOnly: true,
  secure: true,
  sameSite: "None",
})
    .send({
      success: true,
      message: "Logout successfully",
    })
  } catch (error) {
    console.log("error", error)
    res.status(500).send({ success: false, message: "Internal server error" })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("forgetEmail", email)
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 50 * 60 * 1000; // 5 minutes validity
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It expires in 5 minutes.`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Verify OTP and reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    console.log("email, otp, password", email, otp, password)
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // OTP not expired
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







//middleware
export const middleware = (req, res, next) => {
  const token = req.cookies?.Token
  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized access" })
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Invalid or expired token" })
    }

    req.user = decoded
    next()
  })
}
