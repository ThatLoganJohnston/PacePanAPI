import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = 3000;

app.use(cors());

// API endpoint to fetch data
app.get('/api', async (req, res) => {
    try {
        const recentRunsResponse = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
        const recentRunsData = await recentRunsResponse.json();

        const worldStatsResponse = await fetch('https://paceman.gg/stats/api/getWorld/?worldId=786692');
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
const wss = new WebSocketServer({ server });

// Fetch data and broadcast to connected clients
const fetchDataAndBroadcast = async () => {
    try {
        const recentRunsResponse = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
        const recentRunsData = await recentRunsResponse.json();

        const worldStatsResponse = await fetch('https://paceman.gg/stats/api/getWorld/?worldId=661600');
        const worldStatsData = await worldStatsResponse.json();

        const comparisonData = {
            recentRun: recentRunsData[0],
            worldStats: worldStatsData.data,
        };

        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(comparisonData));
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Set interval for fetching data every 5 seconds
setInterval(fetchDataAndBroadcast, 5000);

// Start listening for connections
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
