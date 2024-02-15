const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Fixed token (example)
const fixedToken = 'yourFixedToken';

// Secret key for JWT
const secretKey = 'yourSecretKey';

app.use(express.json());

// Endpoint for generating JWT token if not provided
app.post('/generate-token', (req, res) => {
  const token = jwt.sign({ fixedToken: true }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token || token !== `Bearer ${fixedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err || !decoded.fixedToken) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
