import { ObjectId } from 'mongodb';

// Test mockUser data
const mockUser = [
    {
      _id: new ObjectId('64c020e95c258e3aaaae21d3'),
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      createdAt: '2023-07-25T12:40:58.333+00:00'
  },
  {   _id: new ObjectId('64c0210c5c258e3aaaae21d4'),
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-07-25T12:27:38.643+00:00'
  }
];

// Test new user
const newUser = {
    firstName: 'Valentine',
    lastName: 'Eze',
    email: 'val@example.com',
  };

export {
  mockUser,
  newUser
}