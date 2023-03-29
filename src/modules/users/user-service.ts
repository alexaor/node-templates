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

export const userService = {
  register: registerUser,
  list: () => users,
}
