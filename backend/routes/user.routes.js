import express from 'express'
import { forgotPassword, loginUser, logoutUser, middleware, registerUser, resetPassword } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUser)

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.post("/check-auth", middleware, (req, res) => {
  const { userId, username, email } = req.user; // decoded JWT payload
  console.log("req.user", req.user)
  res.status(200).send({
    success: true,
    message: "Authenticated access granted",
    user: { userId, username, email  }, // clean user object
  });
});

export default userRouter