import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetBalanceError } from "../getBalance/GetBalanceError"
// import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"

let createStatementUseCase: CreateStatementUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository

// let authenticateUserUseCase: AuthenticateUserUseCase

let createUserUseCase: CreateUserUseCase

let getBalanceUseCase: GetBalanceUseCase


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create a new statement', () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    )

    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    )

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    )

    // authenticateUserUseCase = new AuthenticateUserUseCase(
    //   usersRepositoryInMemory
    // )
  })

  it('should be able to create a new deposit statement', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@gmail.com',
      password: '12345'
    }

    const userResult = await createUserUseCase.execute(user)

    const statement: ICreateStatementDTO = {
      user_id: userResult.id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Statement description'
    }

    const result = await createStatementUseCase.execute(statement)

    expect(result).toHaveProperty('id')
    expect(result.type).toBe('deposit')
  })

  it('should be able to create a new withdraw statement', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@gmail.com',
      password: '12345'
    }

    const userResult = await createUserUseCase.execute(user)

    const statement: ICreateStatementDTO = {
      user_id: userResult.id,
      type: 'withdraw' as OperationType,
      amount: 0,
      description: 'Statement description'
    }

    const result = await createStatementUseCase.execute(statement)

    expect(result).toHaveProperty('id')
    expect(result.type).toBe('withdraw')
  })

  it('should be able to create a new withdraw statement with enough balance', async () => {
    expect(async() => {
      const user: ICreateUserDTO = {
        name: 'User Name',
        email: 'user@gmail.com',
        password: '12345'
      }

      const userResult = await createUserUseCase.execute(user)

      await createStatementUseCase.execute({
        user_id: userResult.id,
        type: 'deposit' as OperationType,
        amount: 100,
        description: 'Statement description'
      })

      await createStatementUseCase.execute({
        user_id: userResult.id,
        type: 'withdraw' as OperationType,
        amount: 50,
        description: 'Statement description'
      })
    }).rejects.toBeInstanceOf(GetBalanceError)



    // const withdrawResult = await createStatementUseCase.execute(statement)
    // const { balance } = await getBalanceUseCase.execute({user_id: userResult.id})

    // expect(withdrawResult.amount).toBeLessThanOrEqual(balance)
  })
})
