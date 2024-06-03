const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.ensureAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (err) {
        console.log(err);
        res.redirect('/auth/login');
    }
};
