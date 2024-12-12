// app.js (Node.js Backend)

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// API route to generate random numbers and save to a file
app.get('/generate-random', (req, res) => {
  const randomNumbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)).join(', ');
  const filePath = path.join(__dirname, 'random.txt');

  fs.writeFile(filePath, randomNumbers, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Failed to save file.');
    }
    res.send('File saved successfully with random numbers!');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
