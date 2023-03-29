import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import helmet from './helmet-config'
import httpStatusCodes from './src/httpStatusCodes'
import { authMiddleware, requestLoggerMiddleware } from './src/middleware'
import {
  listUsersHandler,
  registerUserHandler,
} from './src/modules/users/user-handler'

dotenv.config()

export const app: Express = express()
export const logger = require('pino')({
  level: process.env.PINO_LOG_LEVEL || 'info',
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
})

// Apparently doesn't do shit
function appendMissingSlashMiddleware(req: Request, res: Response, next: any) {
  // const requestPath = req.path
  // if (!requestPath.endsWith('/')) {
  //   req.url.slice(requestPath.length)
  // }
  next()
}

// == MIDDLEWARE ==
app.use(authMiddleware)
app.use(helmet())
app.use(requestLoggerMiddleware)
app.use(appendMissingSlashMiddleware)

// == BODY PARSER ==

// Apparently since 4.X something these arent bundled
app.use(express.json()) // Handling body as JSON
app.use(express.urlencoded()) // Handling form data i think

const port = process.env.PORT
const userv1Routes = express.Router()

userv1Routes.route('/').all((req: Request, res: Response) => {
  res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send()
})

userv1Routes.route('/users').get(listUsersHandler).post(registerUserHandler)

app.use('/api/v1', userv1Routes)

// == ROUTES ==
// The app will terminate the request on the first matching route
// meaning middleware needs to be added in the correct order
// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server asa')
// })

// app
//   .route('/api/v1/users')
//   .post(registerUserHandler)
//   .get(listUsersHandler)
//   .all((req: Request, res: Response) => {
//     res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send()
//   })

/**
 * Train for thought
 * We have a route '/api/v1/users' which accepts a POST request to register a user
 * app.route('/api/v1/users').post(
 *  // and inside here we just pipe everything
 *  registerUserHandler()
 *  .userService.register()
 * )
 */

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`)
})
