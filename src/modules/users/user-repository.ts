function mapToUserEntity(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
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
      setTimeout(resolve, 3000)
    ).then(() => {
      return {
        id,
        name: 'John',
        email: 'john@hello.com',
      }
    })

    // Overlkill if db data design is very close to business data design
    return mapToUserEntity(userFromDb)
  },
}
