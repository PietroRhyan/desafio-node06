import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: InMemoryUsersRepository

describe('Create a new user', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory
    )
  })

  it('should be able to create a new user', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@gmail.com',
      password: 'user1234'
    }

    const result = await createUserUseCase.execute(user)

    expect(result).toHaveProperty('id')
  })

  it('should not be able to create a new user with existent email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'User1',
        email: 'user@gmail.com',
        password: 'userPassword'
      })

      await createUserUseCase.execute({
        name: 'User2',
        email: 'user@gmail.com',
        password: 'userPassword123'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
