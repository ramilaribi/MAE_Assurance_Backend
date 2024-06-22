import bcrypt from 'bcrypt';
import UserM from '../models/userModel.js';
import { generateId } from '../utils/generateId.js';


export const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, birthdate, password } = req.body;

    const id = generateId(8);

    // Check if a user with the same email already exists
    const existingUser = await UserM.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserM({
      id,
      fullName,
      email,
      phoneNumber,
      address,
      birthdate,
      password: hashedPassword, // Save the hashed password
      role: "USER"
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// updateAccount controller
export const updateAccount = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log

    const { id, fullName, email, phoneNumber, address, birthdate } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = {
      fullName,
      email,
      phoneNumber,
      address,
      birthdate,
    };

    const user = await UserM.findOneAndUpdate({ id }, updatedUser, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated:', user); // Debug log
    res.status(200).json({ message: 'Account updated successfully', user });
  } catch (error) {
    console.error('Update error:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserM.findOneAndUpdate(
      { id },
      { etatDelete: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserM.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserM.find({ role: "USER", etatDelete: false });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const allUsers = await UserM.find({ role: "ADMIN", etatDelete: false });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserM.findOneAndUpdate({ id }, { banned: true });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unBanUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserM.findOneAndUpdate({ id }, { banned: false });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

