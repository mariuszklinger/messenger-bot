// we get the path of the script
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');

const workerScript = path.join(__dirname, "./utils/parser.js");

// create a new worker from our script
const worker = new Worker(workerScript);

// receive events from the worker
worker.on("message", (sortedArray) => console.log('message:', sortedArray[0]));
worker.on("error", (error) => console.error("error", error));
worker.on("exit", () => console.log("exit"));