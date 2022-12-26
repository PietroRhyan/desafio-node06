import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository

describe('Get statement of the user', () => {
  beforeEach(() => {
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  })

  it('should not be able to get a statement if the user has no statements', () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: 'User Name',
        email: 'user@gmail.com',
        password: 'userPassword'
      })

      const statement_id = '12345'

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id,
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
