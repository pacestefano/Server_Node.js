const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Importa il middleware CORS
const app = express();
const port = process.env.PORT || 3000; // Usa la porta fornita da Render.com

app.use(cors()); // Usa il middleware CORS
app.use(express.json());

app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nel leggere i dati:', err);
            res.status(500).send('Errore nel leggere i dati');
            return;
        }
        console.log('Dati letti con successo:', data);
        res.send(data);
    });
});

app.post('/data', (req, res) => {
    const newData = req.body;
    fs.writeFile('data.json', JSON.stringify(newData), (err) => {
        if (err) {
            console.error('Errore nel salvare i dati:', err);
            res.status(500).send('Errore nel salvare i dati');
            return;
        }
        console.log('Dati salvati con successo:', newData);
        res.send('Dati salvati con successo');
    });
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});