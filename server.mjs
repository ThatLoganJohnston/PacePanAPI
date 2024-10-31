import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import http from 'http';
import WebSocket from 'ws'; // Import the ws package

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        const recentRunsResponse = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
        const recentRunsData = await recentRunsResponse.json();

        const worldStatsResponse = await fetch('https://paceman.gg/stats/api/getWorld/?worldId=661600');
        const worldStatsData = await worldStatsResponse.json();

        const comparisonData = {
            recentRun: recentRunsData[0],
            worldStats: worldStatsData.data,
        };

        res.json(comparisonData);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(new URL('.', import.meta.url).pathname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(new URL('.', import.meta.url).pathname, 'public', 'index.html'));
});

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Create WebSocket server

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    // Optional: Send a message to the new client
    ws.send('Welcome to the WebSocket server!');

    // Broadcast a message to all clients every 5 seconds
    setInterval(() => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('New data available!');
            }
        });
    }, 5000);
});

// Start listening for connections
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
