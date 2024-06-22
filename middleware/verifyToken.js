import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log(`Received Token: ${token}`);
    jwt.verify(token, "secretKey", (err, payload) => {
      if (err) {
        console.log(`Token verification failed: ${err.message}`);
        return res.status(403).json({ message: "Invalid Token" });
      }
      console.log(`Decoded Payload: ${JSON.stringify(payload)}`);
      req.payload = payload;
      next();
    });
  } else {
    console.log('No authorization header provided');
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

export const verifyAndAuth = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await UserModel.findById(req.payload._id);
      if (user) {
        next();
      } else {
        console.log('User not found');
        return res.status(403).json({ message: "You can't access this" });
      }
    } catch (error) {
      console.error(`Error during user verification: ${error.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    await verifyAndAuth(req, res, () => {
      const userRole = req.payload.role; 

      if (userRole === 'ADMIN') {
          next();
      } else {
        return  res.status(403).json({ message: "You are not authorized to perform this action" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
