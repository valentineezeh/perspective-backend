require('dotenv').config(); // eslint-disable-line
const throng = require('throng');
const libStart = require('./lib');

const WORKERS = process.env.WEB_CONCURRENCY || 1;

const start = (id) => {
  console.log(`Started worker ${id}`);

  return libStart();
};

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start,
});
