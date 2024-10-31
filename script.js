const specificTime = 180000; // Example specific time in milliseconds

const fetchData = async () => {
    try {
        const response = await fetch('https://pacepanapi-production.up.railway.app/api');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('timeDifference').innerText = 'Error fetching data';
    }
};

const processData = (data) => {
    const run = data.recentRun; // Adjusted to get recentRun directly
    if (!run) {
        console.error('No recent run data available');
        document.getElementById('timeDifference').innerText = 'No run data available';
        return;
    }

    const netherTime = run.nether;
    const difference = netherTime - specificTime;

    const timeDifferenceDiv = document.getElementById('timeDifference');
    timeDifferenceDiv.innerText = `Time Difference: ${difference} ms`;

    if (difference < 0) {
        timeDifferenceDiv.innerText += ` (Beat by ${Math.abs(difference)} ms!)`;
    } else {
        timeDifferenceDiv.innerText += ` (Missed by ${difference} ms)`;
    }
};

// Fetch data every 30 seconds
setInterval(fetchData, 30000);
fetchData(); // Initial fetch

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",  // Update to your specific domain in production
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Example broadcast interval
    setInterval(() => {
        const data = { message: 'New data!' }; // Replace with actual data
        io.emit('update', data);
    }, 5000);
});

server.listen(8080, () => console.log('Socket server listening'));
