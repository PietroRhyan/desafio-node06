import { Connection } from "typeorm"
import request from 'supertest'

import createConnection from '../../../../database'
import { app } from "../../../../app"

let connection: Connection

const baseUrl = '/api/v1'

describe('Create and view statements', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    await request(app).post('/api/v1/users')
      .send({
        name: 'User Name',
        email: 'user@gmail.com',
        password: 'user123'
      })
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new deposit statement', async () => {
    const authUser = await request(app).post(`${baseUrl}/sessions`)
      .send({
        email: 'user@gmail.com',
        password: 'user123'
      })

    const token = authUser.body.token

    const response = await request(app).post(`${baseUrl}/statements/deposit`)
      .send({
        amount: 100,
        description: 'Test Deposit'
      })
      .set({
        Authorization: `Headers ${token}`
      })

    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.type).toEqual('deposit')
  })

  it('should be able to create a new withdraw statement', async () => {
    const authUser = await request(app).post(`${baseUrl}/sessions`)
      .send({
        email: 'user@gmail.com',
        password: 'user123'
      })

    const token = authUser.body.token

    await request(app).post(`${baseUrl}/statements/deposit`)
      .send({
        amount: 100,
        description: 'Test Deposit'
      })
      .set({
        Authorization: `Headers ${token}`
      })

    const response = await request(app).post(`${baseUrl}/statements/withdraw`)
      .send({
        amount: 100,
        description: 'Test Withdraw'
      })
      .set({
        Authorization: `Headers ${token}`
      })

    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.type).toEqual('withdraw')
  })

  it('should be able to view a specific statement', async () => {
    const authUser = await request(app).post(`${baseUrl}/sessions`)
      .send({
        email: 'user@gmail.com',
        password: 'user123'
      })

    const token = authUser.body.token

    const statement = await request(app).post(`${baseUrl}/statements/deposit`)
      .send({
        amount: 100,
        description: 'Test Deposit'
      })
      .set({
        Authorization: `Headers ${token}`
      })

    const statement_id = statement.body.id

    const response = await request(app).get(`${baseUrl}/statements/${statement_id}`)
      .set({
        Authorization: `Headers ${token}`
      })
      .query({
        statement_id,
      })

    expect(response.body.id).toEqual(statement_id)
  })
})
