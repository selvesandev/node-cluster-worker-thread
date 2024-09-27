const express = require('express');
const router = express.Router();

const app = express();

router.get('/', (req, res) => {
    console.log(`Hello from Worker ${process.pid}`);
    res.send(`Hello from Worker ${process.pid}`);
});

router.get('/about', (req, res) => {
    console.log(`About page handled by Worker ${process.pid}`);
    res.send(`About page handled by Worker ${process.pid}`);
});

router.get('/data', (req, res) => {
    const data = { message: 'This is some data', workerId: process.pid };
    console.log(data);
    res.json(data);
});

router.get('/occupy-thread', (req, res) => {
        // Simulate a CPU-bound task or delay (e.g., busy loop for 10 seconds)
    const delayTime = 20000; // 10 seconds
    const startTime = Date.now();
    console.log(`Occupied ${process.pid}`);

    while (Date.now() - startTime < delayTime) {
        console.log(Date.now() - startTime)            
    }
    res.json({free: true});
});

app.use('/', router);

app.listen(8000, () => {
    console.log(`Worker ${process.pid} started server on port 8000`);
});
