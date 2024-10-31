import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;

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

// Create an HTTP server and a Socket.IO server
const server = http.createServer(app);
const io = new Server(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('a user connected');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
