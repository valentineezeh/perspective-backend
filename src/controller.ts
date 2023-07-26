import { Request, Response } from 'express';
import { collection, } from './db';

export class UserController {
  // Method that handles user creation
  static async createUser (req: Request, res: Response) {
    try {
      // createdAt timestamp that is stored in the db
      const currentTime = new Date()

      // structure request payload
      const reqPayload = {
        ...req.body,
        createdAt: currentTime,
        email: req.body.email.toLowerCase()
      }

      // Make email inputted by user unique
      await collection.createIndex( { email: 1 }, { unique: true } )

      // Insert request payload into DB
      const result = await collection.insertOne(reqPayload)

      // return success response to the user
      return res.status(201).json({
        data: result,
        message: 'Success! User created.',
        error: null
      })
    } catch(error) {
      // return error if something goes wrong
      return res.status(500).json({
        data: {},
        message: 'Internal server error',
        error,
      })
    }
  }

  // Method that handles get all users
  static async getUsers (req: Request, res: Response) {
    try {
      // Extract query from the req.query
      const { created } = req.query

      // fetch all users base on query parameters
      const result = await collection.find({}).sort({ timeStamp: created === 'asc' ? 1 : -1 }).toArray();

      // return success payload
      return res.status(200).json({
        data: result,
        message:'success!',
        error: null
      })
    } catch(error) {
      // return error if something goes wrong
      return res.status(500).json({
        data: [],
        message: 'Internal server error',
        error,
      })
    }
  }
}