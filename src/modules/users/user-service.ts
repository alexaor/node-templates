import crypto from 'crypto'
import { userDb } from '../../db'
import { userRepository } from './user-repository'

/**
 * Services manage business and data access.
 */

const isPromotionalPeriod = () => {
  return true
}

const promoCodeService = {
  generatePromoCode: async function () {
    return 'PROMO_CODE'
  },
}

const users = [
  {
    name: 'John',
    email: 'john@hello.com',
    password: crypto.pbkdf2(
      'password',
      'salt',
      100000,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) throw err
        return derivedKey.toString('hex')
      }
    ),
  },
  {
    name: 'Jane',
    email: 'jane@hello.com',
  },
  {
    name: 'Jack',
    email: 'jack@hello.com',
  },
]

async function registerUser(
  name: string,
  email: string
): Promise<{
  name: string
  email: string
  promoCode?: string
}> {
  // Todo query builder
  const user = {
    name,
    email,
  }

  if (isPromotionalPeriod()) {
    const promoCode = await promoCodeService.generatePromoCode()
    return { ...user, promoCode }
  }

  return user
}

// just export the functions
export const userService = {
  register: registerUser,
  getUser: async (userId: string) => await userRepository.getUser(userId),
  list: () => users,
  hasPermission: (userId: number | string, permissionString: string) => true,
}
