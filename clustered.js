const cluster = require('cluster');
const os = require('os');
const { Worker, isMainThread, parentPort } = require('worker_threads');
const express = require('express');
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('cluster_playground', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries
});

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;  // Get the number of CPU cores

    console.log(`Master process is running with PID: ${process.pid}`);
    console.log(`Forking for ${numCPUs} CPUs...`);

     // Fork a worker process for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for dying workers and fork a new one if necessary
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();  // Create a new worker if one dies
    });


    console.log(numCPUs);
    console.log('here...');    
} else {

    const User = sequelize.define('User', {
        user_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
    },{tableName:'users',timestamps:false});

    sequelize.authenticate().then(() => {
        console.log(`Worker ${process.pid} connected to PostgreSQL`);
        // Sync all defined models to the DB (use { force: true } to drop and recreate tables)
        return sequelize.sync();
    })
    .then(() => {
        const app = express();

        router.get('/', async (req, res) => {
            try {
                const users = await User.findAll();
                console.log(`Hello from Worker ${process.pid}`);
                res.send({
                    thread: `Hello from Worker ${process.pid}`,
                    data: users
                });
                
            } catch (error) {
                console.log(error);
            res.send('failed');        
            }
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

        router.get('/a', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/b', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/c', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/d', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/e', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/f', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/g', (req, res) => {
            console.log(`Hello from Worker ${process.pid}`);
            res.send(`Hello from Worker ${process.pid}`);
        });

        router.get('/occupy-thread', (req, res) => {
            // Simulate a CPU-bound task or delay (e.g., busy loop for 10 seconds)
            const delayTime = 50000; // 10 seconds
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

        console.log(isMainThread);
        console.log('there...')

    })

}

