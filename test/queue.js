'use strict';

const queue = require('../lib/queue');
const processor = require('../lib/processor');
const redis = require('ioredis');
const uuid = require('uuid');
const {expect} = require('chai');

describe('Tracking', () => {
  let queueName;
  let testingQueue;
  let client;

  beforeEach(() => {
    client = new redis();
    return client.flushdb();
  });

  beforeEach(async () => {
    queueName = 'test-' + uuid.v4();
    testingQueue = await queue.createQueue(queueName);
  });

  afterEach(async function() {
    await queue.closeQueue(queueName);

    return client.quit();
  });

  describe('process optIn job', () => {
    it('expects to return expected value', (done) => {

      const message = {
        'timestamp': '2021-06-07T08:32:05.546Z',
        'sentAt': '2021-06-07T08:32:05.547Z',
        'properties': {
          'trackingVersion': 'v3',
          'clientSessionId': 'AFfmr1iGvkrJXxKWid9Ih',
          'clientPersistentId': 'W3hi37-xp--9_pG1jkwIz',
          'pageId': '609a878b0cba83001fb5abd7',
          'companyId': '5fb4eb1a839d81001f800c21',
          'funnelId': '609a878b0cba83001fb5abd2',
          'funnelVersionId': '60a4c19fcf963b001f9f286e',
          'optIns': [
            {
              'fieldName': 'fullName',
              'label': 'Full Name',
              'value': 'Christoph Fey',
            },
            {
              'fieldName': 'email',
              'label': 'Business Email',
              'value': 'christoph@perspective.co',
            },
          ],
        },
        'messageId': 'perspective-q6qmW8wlPgRwJo1JOB1Yz',
      };

      testingQueue
          .on('completed', (job, result) => {
            expect(result).to.deep.equal({success: true});
            done();
          });

      const jobName = 'optIn';
      queue.addMessage(queueName, jobName, message);
      testingQueue.process(jobName, processor);
    });
  });

});
