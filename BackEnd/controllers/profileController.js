const Profile = require('../models/Profile');

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new profile
exports.createProfile = async (req, res) => {
  const { name, cloudinaryUrl } = req.body;
  
  try {
    const newProfile = new Profile({ name, cloudinaryUrl });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};