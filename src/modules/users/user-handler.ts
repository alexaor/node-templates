import { Request, Response } from 'express'
import { z } from 'zod'
import { logger } from '../../../server'
import httpStatusCodes from '../../httpStatusCodes'
import { userService } from './user-service'

const RegisterUserSchema = z.object({
  name: z.string(),
  email: z.string(),
})

/**
 * Handler functions handle validating the request object
 *
 *
 */

export async function registerUserHandler(req: Request, res: Response) {
  const result = RegisterUserSchema.safeParse(req.body)

  if (!result.success) {
    logger.error(result.error.issues)
    return res.status(httpStatusCodes.BAD_REQUEST).send()
  }

  try {
    const { name, email } = result.data
    const user = await userService.register(name, email)
    return (
      res
        .status(httpStatusCodes.CREATED)
        .contentType('application/json')
        // We dont get an error if we return a promise here. Unless we await which makes sense but
        // annoying it does not throw an error runtime or compile time
        .send(user)
    )
  } catch (err) {
    logger.error(err)
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}

export async function listUsersHandler(req: Request, res: Response) {
  try {
    const users = userService.list()
    return res
      .status(httpStatusCodes.OK)
      .contentType('application/json')
      .send(users)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}
