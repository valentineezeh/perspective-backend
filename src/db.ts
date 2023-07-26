import { MongoClient, Db, Collection } from 'mongodb'
import * as dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV,
  DB_URL_TEST,
  DB_URL,
  DB_COLLECTION,
  DB_NAME
} = process.env

const db_url = NODE_ENV === 'test' ? DB_URL_TEST : DB_URL

const dbClient = new MongoClient(db_url)
const db: Db = dbClient.db(DB_NAME);
const collection: Collection = db.collection(DB_COLLECTION);

class DBController {
  // Method to open the MongoDB connection
  static async connectToMongoDB (): Promise<void> {
    try {
      await dbClient.connect();
      console.log('Connected to MongoDB!');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  // Method to close the MongoDB connection
  static async closeDBConnection (): Promise<void> {
    try {
      await dbClient.close();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}

export {
  dbClient,
  db,
  collection,
  DBController
}