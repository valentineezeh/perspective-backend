const Bull = require('bull');

const internals = {
  queues: {},

  createQueue: (queueName) => {
    if (internals.queues[queueName]) {
      return internals.queues[queueName]
    }
    internals.queues[queueName] = new Bull(queueName, process.env.REDIS_URL);
    return internals.queues[queueName];
  },

  addProcessor: (queueName, jobName, jobHandler) => {
    internals.queues[queueName].process(jobName, jobHandler);

    return true;
  },

  addMessage: (queueName, jobName, message) => {
    return internals.queues[queueName].add(jobName, message);
  },

  closeQueue: (queueName) => {
    return internals.queues[queueName].close();
  }
};

module.exports = internals;
