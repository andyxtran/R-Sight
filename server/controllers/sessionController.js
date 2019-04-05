const jwt = require('jsonwebtoken');

const sessionController = {};

sessionController.startSession = (req, res, next) => {
  const jwtPayload = { username: req.body.username };
  const jwtValue = jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: 30000 });
  res.cookie('ssid', jwtValue, { httpOnly: true });
  req.locals = { jwt: jwtValue };

  next();
};

sessionController.isLoggedIn = async (req, res, next) => {
  const { ssid } = req.cookies;
  if (!ssid) return null;
  try {
    jwt.verify(ssid, 'JWT_SECRET_KEY');
    next();
  } catch (err) {
    res.redirect('http://localhost:3000/');
  }
};

sessionController.validateJwt = (req, res) => {
  try {
    const validatedJwt = jwt.verify(req.body.jwt, 'JWT_SECRET_KEY');
    res.json({ validated: true, username: validatedJwt.username });
  } catch (err) {
    res.json({ validated: false });
  }
}

module.exports = sessionController;
