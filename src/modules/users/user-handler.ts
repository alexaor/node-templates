import { Request, Response } from 'express'
import { logger } from '../../server'
import { HttpStatusCodes } from '../../httpStatusCodes'
import { userService } from './user-service'

export async function registerUserHandler(req: Request, res: Response) {
  // const result = RegisterUserSchema.safeParse(req.body)

  // if (!result.success) {
  //   logger.error(result.error.issues)
  //   return res.status(httpStatusCodes.UNPROCESSABLE_ENTITY).send()
  // }

  try {
    const { name, email } = req.body
    const user = await userService.register(name, email)
    return res.status(HttpStatusCodes.CREATED).json(user)
    // We dont get an error if we return a promise here. Unless we await which makes sense but
    // annoying it does not throw an error runtime or compile time
  } catch (err) {
    logger.error(err)
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}

export async function listUsersHandler(req: Request, res: Response) {
  try {
    const users = userService.list()
    return res
      .status(HttpStatusCodes.OK)
      .contentType('application/json')
      .send(users)
  } catch (err) {
    logger.error(err)
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}
