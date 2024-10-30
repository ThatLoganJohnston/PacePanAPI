const specificTime = 180000; // Example specific time in milliseconds

const fetchData = async () => {
    try {
        const response = await fetch('https://thatloganjohnston.github.io/PacePanAPI/api'); // Update with your deployed URL
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
