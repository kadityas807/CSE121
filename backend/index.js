const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, auth } = require('./firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Middleware to verify ID Token
const verifyToken = async (req, res, next) => {
  if (!auth) {
    return res.status(503).send('Authentication service not configured. Please check FIREBASE_SERVICE_ACCOUNT_KEY.');
  }
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.send('Backend is running');
});

// Users Profile Endpoints
app.get('/api/users/:uid', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:uid', verifyToken, async (req, res) => {
  try {
    await db.collection('users').doc(req.params.uid).set(req.body, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic collection endpoints for subcollections (milestones, projects, etc.)
app.get('/api/users/:uid/:collection', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('users').doc(req.params.uid).collection(req.params.collection).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
