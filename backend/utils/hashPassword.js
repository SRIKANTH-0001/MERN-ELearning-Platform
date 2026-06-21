const bcrypt = require("bcryptjs");

/**
 * Hash plain text password
 * @param {String} password
 * @returns {String} hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare passwords
 * @param {String} enteredPassword
 * @param {String} storedPassword
 * @returns {Boolean}
 */
const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
