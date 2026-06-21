const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {String} userId
 * @param {String} role
 * @returns {String} token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = generateToken;
