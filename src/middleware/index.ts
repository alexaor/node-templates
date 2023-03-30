import { Request, Response } from 'express'
import { ZodSchema } from 'zod'
import { logger } from '../../server'
import httpStatusCodes from '../httpStatusCodes'

export function authMiddleware(req: Request, res: Response, next: any) {
  if (!req.headers.authorization) return res.status(401).send('Unauthorized')
  const token = req.headers.authorization.split(' ')[1]

  next()
}

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: any
) {
  logger.info(`${req.method} ${req.path}`)
  next()
}

export function validateRequestMiddleware(schema: ZodSchema) {
  /**
   * @param {ZodSchema} schema
   * @returns {function(req: Request, res: Response, next: any)} - Express middleware
   * @description
   * This middleware will validate the request body against the provided schema.
   * If the validation fails, it will return a 422 response with the validation errors.
   * If the validation succeeds, it will add the cleaned data to the request body. ?? Need to check this

   * @example
   * app.post('/users', validateRequestMiddleware(RegisterUserSchema), nextHandlerFunction)
   */
  return function (req: Request, res: Response, next: any) {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      logger.error(result.error.issues)
      return res
        .status(httpStatusCodes.UNPROCESSABLE_ENTITY.code)
        .send(httpStatusCodes.UNPROCESSABLE_ENTITY.message)
    }

    // Not really sure what is happening here.
    // Maybe a way to add cleaned data to the request body?
    const { data } = result
    Object.assign(req.body, data)

    // Whats the difference between calling next and returning it?
    return next()
  }
}
