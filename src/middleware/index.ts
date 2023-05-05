import { HttpStatusCodes } from '../httpStatusCodes'
import { userRepository } from '../modules/users/user-repository'
import { userService } from '../modules/users/user-service'
import { logger } from '../server'
import { Request, Response } from 'express'
import { ZodSchema } from 'zod'

type AuthenticatedNext = (err?: any) => void

type AuthenticatedRequest = Request & { user: any }

export async function authMiddleware(
  req: Request,
  res: Response,
  next: AuthenticatedNext
) {
  if (!req.headers.authorization) return res.status(401).send('Unauthorized')
  const token = req.headers.authorization.split(' ')[1]

  // locals attr are usually used to store temporary data for the duration of the request
  // not really sure of the difference between using req.locals and res.locals
  const user = await userRepository.getUser('1')



  logger.info(user)

  req.locals = {
    user: user,
  }
  req.tenant = "X-tenant"
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
        .status(HttpStatusCodes.UNPROCESSABLE_ENTITY.code)
        .send(HttpStatusCodes.UNPROCESSABLE_ENTITY.message)
    }

    // Not really sure what is happening here.
    // Maybe a way to add cleaned data to the request body?
    const { data } = result
    Object.assign(req.body, data)

    // Whats the difference between calling next and returning it?
    return next()
  }
}

export function hasAdminRoleMiddleware(req: Request, res: Response, next: any) {
  console.info(JSON.stringify(res.locals))
  console.info(req.tenant)
  //@ts-ignore
  console.info(JSON.stringify(req.locals))
  if (!userService.hasPermission(res.locals.user, 'admin')) {
    return res
      .status(HttpStatusCodes.FORBIDDEN.code)
      .send(HttpStatusCodes.FORBIDDEN.message)
  }

  logger.info(res.locals.user)

  return next()
}
