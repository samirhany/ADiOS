const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// عرض صور الجنس فقط (male1/female/not)
app.use("/profile_photo", express.static("profile_photo"));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
