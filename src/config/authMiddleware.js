const { admin } = require('./db');

/**
 * Middleware to authenticate Firebase ID tokens.
 * Attaches decoded token to req.user.
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Malformed Authorization header.' });
    }

    const token = parts[1];

    // Verify token AND check revocation
    const decodedToken = await admin.auth().verifyIdToken(token, true);

    // Attach only necessary fields (avoid passing entire token blindly)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user', // if using custom claims later
      membership: decodedToken.membership || null
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Token revoked. Please re-authenticate.' });
    }

    return res.status(403).json({ error: 'Invalid or unauthorized token.' });
  }
}

module.exports = authenticateToken;