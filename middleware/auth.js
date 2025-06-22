const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(401).json({ message: 'No user provided' });
    }

    const isUser = await User.findOne({ username: user }); 

    if (!isUser) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    req.user = isUser; 
    next(); 
  } catch (err) {
    res.status(500).json({ message: 'Auth middleware failed', error: err.message });
  }
};

module.exports = authMiddleware
