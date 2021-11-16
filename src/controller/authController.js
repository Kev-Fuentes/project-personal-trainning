const jwt = require('jsonwebtoken');

const getToken = (req, res) => {
  const token = jwt.sign({ user: 'kevin', rol: 'admin' }, process.env.JWT_KEY_SECRET);
  return res.json({ token });
};

module.exports = {
  getToken,
};
