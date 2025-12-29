const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Multer für File Upload
const upload = multer({ dest: '/tmp/uploads/' });

// In-Memory Datenbank (für Demo/Test)
let participants = [];
let users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'team', password: 'team123', role: 'team' },
    { username: 'leitung', password: 'leitung123', role: 'leitung' }
];

// API Endpoints
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ 
            success: true, 
            user: { username: user.username, role: user.role }
        });
    } else {
        res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
    }
});

app.get('/api/participants', (req, res) => {
    res.json(participants);
});

app.post('/api/participants', (req, res) => {
    participants = req.body;
    res.json({ success: true });
});

app.post('/api/upload-excel', upload.single('excel'), (req, res) => {
    try {
        // Simuliere Excel-Verarbeitung
        const sampleData = [
            { id: 1, name: 'Max Mustermann', room: '101', building: 'A', status: 'present' },
            { id: 2, name: 'Anna Schmidt', room: '102', building: 'A', status: 'present' },
            { id: 3, name: 'Tom Weber', room: '201', building: 'B', status: 'absent' }
        ];
        
        participants = sampleData;
        res.json({ success: true, data: participants });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/participants/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = participants.findIndex(p => p.id === id);
    
    if (index !== -1) {
        participants[index] = { ...participants[index], ...req.body };
        res.json({ success: true, participant: participants[index] });
    } else {
        res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Vercel Export
module.exports = app;