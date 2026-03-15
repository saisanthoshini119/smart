const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React Router - serve index.html for all routes except API
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // This will be handled by your backend API
    return;
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;