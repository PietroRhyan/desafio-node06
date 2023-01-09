import { Connection } from "typeorm"
import request from 'supertest'

import createConnection from '../../../../database'
import { app } from "../../../../app"

let connection: Connection

describe('Authenticate a user', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app).post('/api/v1/users')
      .send({
        name: 'Integration Test User',
        email: 'integrationuser@gmail.com',
        password: 'testIntegration'
    })

    const response = await request(app).post('/api/v1/sessions')
      .send({
        email: 'integrationuser@gmail.com',
        password: 'testIntegration'
      })

    expect(response.body).toHaveProperty('token')
  })
})
