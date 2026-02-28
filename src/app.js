
require('dotenv').config();
const express = require('express');
const { db } = require('./config/db'); // Ensure Firebase Admin SDK is initialized

const userRouter = require('./routes/user-router');
const contentRouter = require('./routes/content-router');
const episodeRouter = require('./routes/episode-router');

const path = require("path"); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

//frontend
app.use(express.static(path.join(__dirname, "../public")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Rutas del backend
app.use('/users', userRouter);
app.use('/content', contentRouter);
app.use('/episodes', episodeRouter);

// Basic API route
app.get('/api/data', async (req, res) => {
  try {
    const snapshot = await db.collection('myCollection').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});