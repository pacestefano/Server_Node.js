const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Importa il middleware CORS
const app = express();
const port = process.env.PORT || 3000; // Usa la porta fornita da Render.com

app.use(cors()); // Usa il middleware CORS
app.use(express.json());
app.use(express.static('public')); // Serve i file statici dalla directory 'public'

// Inizializza il database SQLite
const db = new sqlite3.Database('data.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS waterData (id INTEGER PRIMARY KEY, liters REAL, timestamp TEXT)");
});

app.get('/data', (req, res) => {
    db.all("SELECT * FROM waterData", (err, rows) => {
        if (err) {
            console.error('Errore nel leggere i dati:', err);
            res.status(500).send('Errore nel leggere i dati');
            return;
        }
        res.setHeader('Access-Control-Allow-Origin', '*'); // Permetti le richieste CORS da qualsiasi origine
        res.send(rows);
    });
});

app.post('/data', (req, res) => {
    const waterData = req.body;
    db.serialize(() => {
        db.run("DELETE FROM waterData");
        const stmt = db.prepare("INSERT INTO waterData (liters, timestamp) VALUES (?, ?)");
        waterData.forEach(data => {
            stmt.run(data.liters, data.timestamp);
        });
        stmt.finalize();
    });
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permetti le richieste CORS da qualsiasi origine
    res.send('Dati salvati con successo');
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});