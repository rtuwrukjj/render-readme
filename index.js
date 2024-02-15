const express = require('express');
const readme = require('readmeio');

const app = express();
const PORT = 3000;

const protectedToken = 'abcdefghijkl123456789';
const secret = 'EyFO3LKKNpwpoDO9joWQELNDrXcNPQYx';


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

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
  // Verify the request is legitimate and came from ReadMe.
  const signature = req.headers['readme-signature'];

  try {
    readme.verifyWebhook(req.body, signature, secret);
  } catch (e) {
    // Handle invalid requests
    return res.status(401).json({ error: e.message });
  }

  // Fetch the user from the database and return their data for use with OpenAPI variables.
  // const user = await db.find({ email: req.body.email })
  return res.json({
    // OAS Security variables
    bearerAuth: "abcdefghijkl123456789",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
