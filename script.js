const specificTime = 180000; // Example specific time in milliseconds

const fetchData = async () => {
    try {
        const response = await fetch('https://pacepanapi-production.up.railway.app/api'); // Update with your deployed URL
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
    const run = data[0]; // Assuming you're interested in the first run
    const netherTime = run.nether;
    const difference = netherTime - specificTime;

    // Update the overlay text
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
        origin: "*",  // Or specify OBS overlay domain
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Broadcast data changes
    function sendUpdate(data) {
        io.emit('update', data);
    }

    // Example broadcast interval
    setInterval(() => sendUpdate({ message: 'New data!' }), 5000);
});

server.listen(8080, () => console.log('Socket server listening'));


