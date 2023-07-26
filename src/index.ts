import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { DBController } from './db'
import { validateUserInput, validateGetUserQuery } from './middleware'
import { UserController } from './controller'

dotenv.config();

const app: Express = express();

app.use(cors())
  .use(express.json())
  .options('*', cors());

// Connect to the MongoDB when the server starts
DBController.connectToMongoDB()

// routes with middleware validation and controllers
app.post('/users', validateUserInput, UserController.createUser);
app.get('/users', validateGetUserQuery, UserController.getUsers);

// Close the MongoDB connection when the server is shutting down
process.on('SIGINT', async () => {
  await DBController.closeDBConnection();
  process.exit(0);
});

const port = process.env.PORT || 3111;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
