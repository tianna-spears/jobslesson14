const User = require('../models/User') // Make sure you have this

const authMiddleware = async (req, res, next) => {
  try {
    const { user } = req.body; // or req.session.user / req.user

    if (!user) {
      return res.status(401).json({ message: 'No user provided' });
    }

    const isUser = await User.findOne({ username: user }); // or email, or _id

    if (!isUser) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    req.user = isUser; // Attach user to request for downstream use
    next(); // Pass control to next middleware/route
  } catch (err) {
    res.status(500).json({ message: 'Auth middleware failed', error: err.message });
  }
};
