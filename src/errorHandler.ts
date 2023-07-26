import { Request, Response, NextFunction } from 'express';

const handleValidations = (req: Request, res: Response, next: NextFunction) => {
  const error = req;
  const validationErrors = [];
  if (error) {
    error.map(err => validationErrors.push(err.param));
    const field = validationErrors.join(',');
    const message = validationErrors.length > 1 ? `The fields ${field} are required` : `The field ${field} is required`;
    return res.status(400).json({
      error: {
        code: 'USR_02',
        message,
        field,
        status: '500'
      }
    });
  }
  next();
};

export default handleValidations;