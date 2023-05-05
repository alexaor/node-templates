declare namespace Express {
  export interface Request {
    tenant?: string
    locals?: {
      user?: any
    }
  }
}
