// userService.js

import jwt from 'jsonwebtoken';
import UserM from '../models/userModel.js';
import bcrypt from 'bcrypt';

export async function checkUser(data) {
  try {
    return await UserM.findOne({ id: data });
  } catch (error) {
    throw error;
  }
}

export async function generateToken(tokenData, secretKey, jwtExpire) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpire });
}

export async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("oldpwd", hashedPassword);
    console.log("new", password);
    return isMatch;
  } catch (error) {
    throw error;
  }
}

export function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  const codeLength = 4;

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

const generateRandomCode = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default { comparePassword, generateToken, checkUser, generateCode, generateRandomCode };
