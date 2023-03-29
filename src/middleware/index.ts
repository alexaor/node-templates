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
  return function (req: Request, res: Response, next: any) {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      logger.error(result.error.issues)
      return res
        .status(httpStatusCodes.UNPROCESSABLE_ENTITY.code)
        .send(httpStatusCodes.UNPROCESSABLE_ENTITY.message)
    }


    // Not really sure what is happening here
    const { data } = result
    Object.assign(req.body, data)

    // Whats the difference between calling next and returning it?
    return next()
  }
}
