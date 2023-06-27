const queue = require('./queue');
const processor = require('./processor');

module.exports = async () => {
  const queueName = 'tracking';

  await queue.createQueue(queueName);

  queue.addProcessor(queueName, 'optIn', processor);
};
