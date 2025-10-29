// src/api/login.js

export default function handler(req, res) {
  // We only want to handle POST requests to this endpoint
  if (req.method !== 'POST') {
    // Tell the client what methods are allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get the username and password from the request body sent by the form
  const { username, password } = req.body;

  // Securely access the environment variables on the server.
  // These are NOT exposed to the client.
  const validUsername = process.env.VALID_USERNAME;
  const validPassword = process.env.VALID_PASSWORD;

  // Check if the provided credentials match the ones from your environment variables
  if (username === validUsername && password === validPassword) {
    // IMPORTANT: In a real-world application, you wouldn't just return success.
    // You would generate a secure token (like a JWT) or a session cookie
    // to keep the user logged in. For this example, a success message is fine.
    return res.status(200).json({ success: true, message: 'Login Successful' });
  } else {
    // If credentials do not match, send a clear error message.
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
}