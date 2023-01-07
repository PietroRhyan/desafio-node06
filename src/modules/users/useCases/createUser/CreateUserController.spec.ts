import { Connection } from "typeorm"
import request from 'supertest'

import createConnection from "../../../../database"
import { app } from "../../../../app"

let connection: Connection

describe('Create a new user', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users')
      .send({
        name: 'Integration Test User',
        email: 'integrationuser@gmail.com',
        password: 'testIntegration'
      })

    console.log(response.body)

    expect(response.status).toEqual(201)
  })
})
