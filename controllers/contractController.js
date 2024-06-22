import ContractModel from '../models/contratModel.js'

// Create a new contract (Admin only)
export const createContract = async (req, res) => {
  try {
    const { startDate, endDate, coverageDetails, prime, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const newContract = new ContractModel({
      startDate,
      endDate,
      coverageDetails,
      prime,
      user: userId
    });

    await newContract.save();

    res.status(201).json({ message: 'Contract created successfully', contract: newContract });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contract', error: error.message });
  }
};

// Get all contracts (optional admin only)
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await ContractModel.find().populate('user', 'fullName email');
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error: error.message });
  }
};

// Get contracts associated with a specific user
export const getContractsByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const contracts = await ContractModel.find({ user: userId }).populate('user', 'fullName email');
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error: error.message });
  }
};

// Get a single contract by ID
export const getContractById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Contract ID is required' });
    }
    const contract = await ContractModel.findById(id).populate('user', 'fullName email');
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contract', error: error.message });
  }
};

// Update a contract by ID (Admin only)
export const updateContract = async (req, res) => {
  try {
    const { id, startDate, endDate, coverageDetails, prime } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Contract ID is required' });
    }

    const updatedContract = await ContractModel.findByIdAndUpdate(
      id,
      { startDate, endDate, coverageDetails, prime },
      { new: true, runValidators: true }
    ).populate('user', 'fullName email');

    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json({ message: 'Contract updated successfully', contract: updatedContract });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error: error.message });
  }
};

// Delete a contract by ID (Admin only)
export const deleteContract = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Contract ID is required' });
    }
    const deletedContract = await ContractModel.findByIdAndDelete(id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contract', error: error.message });
  }
};