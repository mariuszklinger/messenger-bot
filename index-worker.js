const path = require('path');
const { Worker, isMainThread } = require('worker_threads');

const workerScript = path.join(__dirname, './utils/parser.js');

const worker = new Worker(workerScript);

worker.on('message', sortedArray => console.log('message:', sortedArray[0]));
worker.on('error', error => console.error('error', error));
worker.on('exit', () => console.log('exit'));
