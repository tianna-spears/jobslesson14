const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized: No session found' });
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(500).json({ message: 'Authentication failed', error: err.message });
  }
};

module.exports = requireAuth;
