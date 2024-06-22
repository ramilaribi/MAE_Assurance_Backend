
import UserService from "../services/UserService.js";
import UserM from "../models/userModel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateId } from '../utils/generateId.js'; 
import { checkUser, generateToken , generateCode } from '../services/UserService.js';  
dotenv.config();

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e5dab2feb37ad0",
    pass: "0306da7b993bea"
  }
});





export const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await UserM.findOne({ id });
    if (!user) {
      return res.status(404).json({ status: false, token: "", error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, token: "", error: "Invalid password" });
    }

    const tokenData = { _id: user._id, phoneNumber: user.phoneNumber };
    const token = jwt.sign(tokenData, "secretKey", { expiresIn: "90d" });

    res.status(200).json({
      status: true,
      token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        birthdate: user.birthdate,
        role: user.role,
        etatDelete: user.etatDelete,
        _id: user._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      error: ""
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ status: false, token: "", error: error.message });
  }
};

async function loginAdmin(req, res) {
    try {
      const { data, password } = req.body;
      const user = await UserService.checkUser(data);
      console.log(user);
      if (!user) {
        res
          .status(404)
          .json({ status: false, token: "", error: "User does not exist" });
      }
      if (user.role === "ADMIN") {
        const isMatch = await UserService.comparePassword(
          password,
          user.password
        );
        if (isMatch === false) {
          res
            .status(401)
            .json({ status: false, token: "", error: "Invalid password" });
        }
  
        const tokenData = { _id: user._id, phoneNumber: user.phoneNumber };
        const token = await UserService.generateToken(
          tokenData,
          "secretKey",
          "5h"
        );
        res.status(200).json({ status: true, token: token, error: "" });
      } else {
        res.status(403).json({ status: false, token: "", error:"You are not authorized to perform this action"});
      }
    } catch (error) {
      res.status(500).json({ status: false, token: "", error: error });
    }
  }
  
  export const forgotPwd = async (req, res) => {
    try {
      const { data } = req.body;
      const user = await checkUser(data);
      const random = generateCode();
  
      if (!user) {
        return res.status(404).json({ status: false, token: "", error: "User not found" });
      } else {
        const tokenData = {
          _id: user._id,
          email: user.email,
          code: random,
        };
        const token = await generateToken(tokenData, "secretKey", "1h"); 
        await transporter.sendMail({
          from: '"MAE" <MAE@example.com>',
          to: user.email,
          subject: "Reset your password",
          html: `<h1><strong>Hi! ${user.firstName}</strong></h1><h3>We have received a request to reset your password.</h3>Verification code: ${random}`,
        });
        console.log(`Message sent: ${token}`);
        return res.status(200).json({ status: true, token: token, error: "" });
      }
    } catch (error) {
      console.error(`Error during password reset request: ${error.message}`);
      return res.status(500).json({ status: false, token: "", error: error.message });
    }
  };
  export const otp = async (req, res) => {
    try {
      const code = req.body.data;
      const token = req.headers['authorization'].split(' ')[1];
      console.log(`Received Token: ${token}`);
      const decodedToken = jwt.verify(token, 'secretKey');
      console.log(`Decoded Payload: ${JSON.stringify(decodedToken)}`);
  
      if (decodedToken.code.trim() === code.trim()) {
        const tokenData = {
          _id: decodedToken._id,
          email: decodedToken.email,
          code: code,
        };
        const newToken = jwt.sign(tokenData, "secretKey", { expiresIn: "5m" });
        console.log(`Generated Token: ${newToken}`);
        res.status(200).json({ status: true, token: newToken, error: "" });
      } else {
        return res.status(403).json({ status: false, token: "", error: "Invalid code" });
      }
    } catch (error) {
      console.error(`Error during OTP verification: ${error.message}`);
      return res.status(500).json({ status: false, token: "", error: error.message });
    }
  };
  export const newPwd = async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(403).json({ status: false, error: 'No token provided' });
      }
  
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, 'secretKey');
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the new password
  
      const user = await UserM.findOneAndUpdate(
        { _id: decodedToken._id },
        { password: req.body.password }, 
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ status: false, token: "", error: "User not found" });
      } else {
        return res.status(200).json({ status: true, token: "", error: "" });
      }
    } catch (error) {
      console.error(`Error during password reset: ${error.message}`);
      return res.status(500).json({ status: false, token: "", error: error.message });
    }
  };
  async function newAdmin(req, res, next) {
    try {
      const { 
        fullName,
        email,
        phoneNumber,
        password,
        adress,
        birthdate,
      } = req.body;
      
      const avatar = req.file?.filename;
      const id = generateId();  // Generate a unique 8-character ID
  
      const createUser = new UserM({
        id,
        fullName,
        email,
        phoneNumber,
        password,
        adress,
        birthdate,
        avatar,
        role: "ADMIN"
      });
      
      await createUser.save();
      res.status(201).json({ status: true, response: "Admin Registered" , createUser });
    } catch (error) {
      if (error.keyPattern) {
        console.log("Error", error);
        res.status(403).json({
          status: false,
          response: Object.keys(error.keyPattern)[0] + " already used",
        });
      } else {
        console.log("err", error);
        res.status(500).json({ status: false, response: "Internal Server Error" });
      }
    }
  }
  export default {  login, forgotPwd, newPwd, otp , loginAdmin , newAdmin };
  