import { Request, Response } from 'express'
import { logger } from '../../server'

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
