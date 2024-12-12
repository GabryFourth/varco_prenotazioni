const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Set up the transporter for sending email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stefano.finotti.drive@gmail.com', // Replace with your email
    pass: 'finotti.123OK!' // Replace with your email password (or use OAuth2 for better security)
  }
});

app.use(express.json());  // This will parse the JSON body of incoming requests

// Serve static files from the 'public' directory (if you want to separate assets)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve il file JSON quando viene richiesto
app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  
  // Leggi il file JSON e rispondi con i dati
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});


// Gestisci l'aggiornamento del file JSON
app.post('/update', (req, res) => {
  const updatedData = req.body;

  const filePath = path.join(__dirname, 'data.json');

  // Scrivi i dati aggiornati nel file
  fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error updating file');
    }
    res.json({ message: 'File JSON aggiornato con successo', data: updatedData });
  });
});

// Route to handle sending email
app.post('/sendMail', (req, res) => {
  const updatedData = req.body;

  // Prepare email content
  const emailContent = JSON.stringify(updatedData, null, 2);

  // Email options
  const mailOptions = {
    from: 'stefano.finotti.drive@gmail.com', // Replace with your email
    to: 'varco.pov@gmail.com',
    subject: 'Prenotazione effettuata dal sito',
    text: `ecco i dati:\n\n${emailContent}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
