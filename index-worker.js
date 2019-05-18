require('dotenv').config();

const path = require('path');
const { spawn } = require('child_process');
const numChild = 2; // require('os').cpus().length;
const db = require('./utils/dbConn');
const WatchRequestModel = require('./models/WatchRequest');

const workerPath = path.join(__dirname, './services/RequestWorker.js');

console.log('Number of child process to spawn: ', numChild);

const countRecords = async () => WatchRequestModel.countDocuments({}).exec();

async function getElementsArray(cores = numChild) {
  const size = await countRecords();
  const regularOffset = Math.floor(size / cores);
  const offsets = Array(cores).fill(regularOffset);

  if (regularOffset * cores !== size) {
    const rest = size - (regularOffset * cores);
    offsets[0] += rest;
  }

  return offsets;
}

async function init() {
  const elementsAmounts = await getElementsArray();
  let lastOffset = 0;

  return [...Array(numChild)].map((_, i) => {
    const amount = elementsAmounts[i];

    const child = spawn('node', [workerPath, 0, 999], {
      detached: true,
    });

    lastOffset += amount;

    const cb = data => console.log(`[WORKER #${i}]: ${data}`);

    child.stdout.on('data', cb);
    child.stderr.on('data', cb);
    child.on('close', cb);

    return child;
  });
}

if (!module.parent) {
  db.once('open', init);
}

module.exports = () => db.once('open', init);
