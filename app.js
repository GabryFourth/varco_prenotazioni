// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated database
let bookings = [
    { date: '2024-12-15', priceOption: 'Option 1', contactInfo: { name: 'John Doe', email: 'john@example.com', phone: '123456789' } }
];

// Endpoint to get bookings
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// Endpoint to create a booking
app.post('/api/bookings', (req, res) => {
    const { date, priceOption, contactInfo } = req.body;

    // Check if date is already booked
    if (bookings.some(booking => booking.date === date)) {
        return res.status(400).json({ message: 'Date already booked' });
    }

    bookings.push({ date, priceOption, contactInfo });
    res.status(201).json({ message: 'Booking successful' });
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});