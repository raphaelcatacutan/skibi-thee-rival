const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Allow Android device to send requests
app.use(cors());

// Serve static HTML and uploaded images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file upload with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Use unique filename
  }
});
const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('File received:', req.file);
  res.send('File uploaded successfully');
});

// Endpoint to get all image filenames
app.get('/images', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files');
    }
    // Filter image files (you can extend this to other image types)
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/));
    res.json(imageFiles);  // Send back the list of image filenames
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}`);
});
