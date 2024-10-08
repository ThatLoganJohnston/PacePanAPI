import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path'; // Add this line

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        const response = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(import.meta.url, 'public')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.url, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Proxy server is running at http://localhost:${PORT}`);
});
