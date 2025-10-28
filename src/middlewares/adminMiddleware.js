const adminMiddleware = (req, res, next) => {
  
    if (!req.user) {
        return res.status(401).json({ error: 'Access denied. Authentication required.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
};

module.exports = adminMiddleware;