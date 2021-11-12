const jwt = require('jsonwebtoken');

const tokenValidate = (req, res, next) => {
  const bearerHeader = req.headers?.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const [, token] = bearer;
    jwt.verify(token, process.env.JWT_KEY_SECRET, (err) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.token = token;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = tokenValidate;
