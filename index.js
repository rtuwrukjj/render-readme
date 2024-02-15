const express = require('express');

const app = express();
const PORT = 3000;

const protectedToken = 'abcdefghijkl123456789';

app.use(express.json());

// Protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token || token !== `Bearer ${protectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // If the token is correct, proceed to the next middleware or route handler
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
