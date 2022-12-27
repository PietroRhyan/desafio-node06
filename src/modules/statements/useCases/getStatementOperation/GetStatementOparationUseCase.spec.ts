import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

let getStatementOperationUseCase: GetStatementOperationUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

let authenticateUserUseCase: AuthenticateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}


describe('Get statement of the user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementsRepositoryInMemory = new InMemoryStatementsRepository()

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )

    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    )

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    )

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  })

  it('should be able to get a statement information', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@gmail.com',
      password: 'user1234'
    }

    const userResult = await createUserUseCase.execute(user)

    await authenticateUserUseCase.execute({
      email: 'user@gmail.com',
      password: 'user1234',
    })

    const statement = await createStatementUseCase.execute({
      user_id: userResult.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'Statement description'
    })

    const userStatement = await getStatementOperationUseCase.execute({
      user_id: userResult.id,
      statement_id: statement.id
    })

    expect(userStatement).toHaveProperty('id')
  })

  it('should not be able to get a statement if the user has no statements', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'User Name',
        email: 'user@gmail.com',
        password: 'user1234'
      }

      const result = await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'user@gmail.com',
        password: 'user1234',
      })

      const statement_id = '12345'

      const test = await getStatementOperationUseCase.execute({
        user_id: result.id,
        statement_id,
      })

      console.log(test)
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
