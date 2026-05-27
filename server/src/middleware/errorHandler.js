import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log full stack in development, otherwise just clean message
  if (process.env.NODE_ENV === 'development') {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.error(err.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { status: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: '${err.keyValue[field]}' for field: '${field}'`;
    error = { status: 400, message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { status: 400, message };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = { status: 401, message: 'Invalid token, access denied' };
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error = { status: 401, message: 'Token expired, please log in again' };
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
