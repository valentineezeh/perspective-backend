import { Request, Response, NextFunction } from 'express';
import { Body, Query } from './types'

// User input validation
const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const {
    firstName,
    lastName,
    email,
  }: Body = req.body
  const errors = {} as Body

  // email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = 'This field is required'
  }
  if (firstName && firstName.trim().length <= 2) {
    errors.firstName = 'First name must be greater than 2 characters'
  }
  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = 'This field is required'
  }
  if (lastName && lastName.trim().length <= 2) {
    errors.lastName = 'Last name must be greater than 2 characters'
  }
  if (!email || email.trim().length === 0) {
    errors.email = 'This field is required'
  }
  if (!emailRegex.test(email)) {
    errors.email = 'Invalid email inputted'
  }

  return Object.keys(errors).length === 0 ? next() : res.status(400).json({
    data: {},
    message: 'Validation failed',
    errors
  })
}

// Get all users query validation
const validateGetUserQuery = (req: Request, res: Response, next: NextFunction) => {
  const { created } = req.query
  const errors = {} as Query

  if (created && created !== 'asc' && created !== 'desc') {
    errors.created = `Created can either be 'asc' or 'desc'.`
  }

  return Object.keys(errors).length === 0 ? next() : res.status(400).json({
    data: [],
    message: 'Validation failed',
    errors
  })
}

export {
  validateUserInput,
  validateGetUserQuery
}