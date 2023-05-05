import { userService } from './user-service'

function mapToUserEntity(user: any) {
  return user
}

export const userRepository = {
  register: async function (name: string, email: string) {
    // Todo query builder
    const user = {
      name,
      email,
    }

    return user
  },

  async getUser(id: string) {
    const userFromDb = await new Promise(resolve =>
      setTimeout(resolve, 200)
    ).then(() => {
      userService.getUser(id)
    })

    // Overlkill if db data design is very close to business data design
    return mapToUserEntity(userFromDb)
  },
}
