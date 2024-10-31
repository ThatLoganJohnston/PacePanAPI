import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api', async (req, res) => {
    try {
        // Fetch recent runs
        const recentRunsResponse = await fetch('https://paceman.gg/stats/api/getRecentRuns/?name=That_Logan_Guy&hours=24&limit=1');
        const recentRunsData = await recentRunsResponse.json();

        // Fetch specific world stats
        const worldStatsResponse = await fetch('https://paceman.gg/stats/api/getWorld/?worldId=661600');
        const worldStatsData = await worldStatsResponse.json();

        // Combine the data
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

app.listen(PORT, () => {
    console.log(`Proxy server is running at http://localhost:${PORT}`);
});
