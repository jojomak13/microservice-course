import { ValidationError } from 'express-validator';
import CustomError from './CutsomError';

class RequestValidationError extends CustomError {
  private errors: ValidationError[];
  public statusCode: number = 400;

  constructor(errors: ValidationError[]) {
    super('Validation error');

    this.errors = errors;
    this.name = 'Request Validation Error';

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serialize() {
    const errors = this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });

    return { type: this.name, errors };
  }
}

export default RequestValidationError;
