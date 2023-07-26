import { describe, expect, test } from '@jest/globals';
import { Db, MongoClient } from 'mongodb';
import request from 'supertest';
import app from '../src/index'
import { mockUser, newUser } from './mockData';

let connection: MongoClient;
let db: Db;

describe('Application test', () => {

    const {
        DB_URL_TEST,
        DB_COLLECTION,
        DB_NAME
      } = process.env

  beforeEach(async() => {
    try {
        connection = await MongoClient.connect(DB_URL_TEST);
        db = await connection.db(DB_NAME);

        const users = db.collection(DB_COLLECTION);
        await users.insertMany(mockUser);
    } catch(error) {
        console.error('Error starting MongoDB:', error);
    }
  })

  test('it passes the tests', () => {
    expect(true).toEqual(true);
});

  test('MongoDB connection should be established', () => {
        expect(connection).toBeDefined();
    })

  test('It should insert a doc into collection and fetch all users', async () => {
    try {
        // Perform the API request to fetch all users
        const resp = await request(app).get('/users')
        expect(resp.status).toEqual(200);
        expect(resp.body.data).toHaveLength(2)
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should return an error message when an invalid query is inputted', async () => {
    try {
        // Perform the API request to fetch all users when wrong query is inputted
        const resp = await request(app).get('/users?created=api')

        expect(resp.status).toEqual(400);
        expect(resp.body.data).toHaveLength(0);
        expect(resp.body.message).toEqual('Validation failed');
        expect(resp.body.errors.created).toEqual("Created can either be 'asc' or 'desc'.")

    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should return an array of users in a descending order', async () => {
    try {
        // Perform the API request to fetch all users in a descending order
        const resp = await request(app).get('/users?created=desc')

        expect(resp.status).toEqual(200);
        expect(resp.body.data).toHaveLength(2);
        expect(resp.body.message).toEqual('success!');

    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when first name is not inputted', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, firstName: '' })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.firstName).toEqual('This field is required')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when first name inputted is less and equal to 2 characters', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, firstName: 'bi' })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.firstName).toEqual('First name must be greater than 2 characters')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when last name is not inputted', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, lastName: '' })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.lastName).toEqual('This field is required')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when last name inputted is less than and equal to 2 characters', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, lastName: 'AB' })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.lastName).toEqual('Last name must be greater than 2 characters')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when email is not inputted', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, email: null })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.email).toEqual('Invalid email inputted')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an error when invalid email is not inputted', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({ ...newUser, email: 'wrong-email' })
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(400);
        expect(resp.body.message).toEqual('Validation failed')
        expect(resp.body.errors.email).toEqual('Invalid email inputted')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should add a new user in the DB', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send(newUser)
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(201);
        expect(resp.body.message).toEqual('Success! User created.')
    } catch(error) {
        throw new Error(error)
    }
  });

  test('It should throw an internal server error when email that already exist is inserted', async () => {
    try {
        // Perform the API request to add a user in the DB
        const resp = await request(app).post('/users')
                        .send({...newUser, email: 'john@example.com'})
                        .set('Accept', 'application/json');

        // Assert the response body or any other relevant data
        expect(resp.status).toEqual(500);
        expect(resp.body.message).toEqual('Internal server error')
    } catch(error) {
        throw new Error(error)
    }
  });

  afterEach(async () => {
    try {
        await db.collection(DB_COLLECTION).deleteMany({})
        await connection.close();
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
      }
  })
});
