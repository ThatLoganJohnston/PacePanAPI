import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import http from 'http';
import { Server } from 'ws'; // Using 'ws' for WebSocket

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

// Create HTTP server
const server = http.createServer(app);
const wss = new Server({ server }); // Create WebSocket server

wss.on('connection', (ws) => {
    console.log('A user connected');

    const sendDataUpdate = async () => {
        try {
            const response = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
            const recentRunsData = await response.json();
            ws.send(JSON.stringify(recentRunsData[0])); // Send new data to client
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Send data immediately on connection
    sendDataUpdate();

    // Set interval to fetch data every 30 seconds
    const intervalId = setInterval(sendDataUpdate, 30000);

    ws.on('close', () => {
        console.log('User disconnected');
        clearInterval(intervalId);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
