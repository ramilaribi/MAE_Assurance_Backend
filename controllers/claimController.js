import ClaimModel from '../models/claimModel.js';
import UserModel from '../models/userModel.js';

// Create a new claim
export const createClaim = async (req, res) => {
  try {
    const userId = req.payload._id; // Extract user ID from the authenticated payload
    const { title, description } = req.body; // Extract title and description from the request body

    console.log('Payload:', req.payload); // Debug log
    console.log('Request body:', req.body); // Debug log

    // Check if the user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      console.log('User not found'); // Debug log
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new claim
    const newClaim = new ClaimModel({
      user: userId,
      title,
      description
    });

    // Save the new claim to the database
    await newClaim.save();

    console.log('New claim created:', newClaim); // Debug log

    // Prepare the response
    const response = {
      user: newClaim.user,
      title: newClaim.title,
      description: newClaim.description,
      _id: newClaim._id,
      createdAt: newClaim.createdAt,
      status: newClaim.status,
      etatDelete: newClaim.etatDelete
    };

    // Send the response
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating claim:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};


// Get all claims
export const getAllClaims = async (req, res) => {
  try {
    const claims = await ClaimModel.find({ etatDelete: false }).populate('user', 'fullName email');
    const response = claims.map(claim => ({
      _id: claim._id,
      user: {
        _id: claim.user._id,
        fullName: claim.user.fullName,
        email: claim.user.email
      },
      description: claim.description,
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt
    }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single claim by ID
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.body;
    const claim = await ClaimModel.findOne({ _id: id, etatDelete: false }).populate('user', 'fullName email');
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.status(200).json({_id: claim._id,
        user: {
          _id: claim.user._id,
          fullName: claim.user.fullName,
          email: claim.user.email
        },
        description: claim.description,
        createdAt: claim.createdAt,
        updatedAt: claim.updatedAt});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a claim by ID
export const updateClaim = async (req, res) => {
    try {
      const userId = req.payload._id; // Extract user ID from the authenticated payload
      const { id, description } = req.body;
  
      // Check if user exists (optional)
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updatedClaim = await ClaimModel.findByIdAndUpdate(
        id,
        { user: userId, description },
        { new: true, runValidators: true }
      ).populate('user', 'fullName email');
  
      if (!updatedClaim) {
        return res.status(404).json({ message: "Claim not found" });
      }
  
      res.status(200).json({
        _id: updatedClaim._id,
        user: {
          _id: updatedClaim.user._id,
          fullName: updatedClaim.user.fullName,
          email: updatedClaim.user.email
        },
        description: updatedClaim.description,
        createdAt: updatedClaim.createdAt
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a claim by ID
  export const deleteClaim = async (req, res) => {
    try {
      const { id } = req.body;
      const updatedClaim = await ClaimModel.findByIdAndUpdate(
        id,
        { etatDelete: true },
        { new: true }
      );
      if (!updatedClaim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      res.status(200).json({ message: "Claim deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export default {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim
};
