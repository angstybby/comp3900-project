// src/tests/auth.test.ts
import { describe, expect, it, test } from 'vitest'
import prisma from './helpers/prisma'
import request from 'supertest'
import app from 'lib/createServer'

describe('/auth', async () => {
  describe('[POST] /auth/signup', () => {
    // ----------------------------------------------
    //              Refrence Test
    // ----------------------------------------------
    // it('should respond with a `200` status code and user details', async () => {
    //   const { status, body } = await request(app).post('/auth/signup').send({
    //     username: 'testusername',
    //     password: 'testpassword'
    //   })
    //   // 2
    //  const newUser = await prisma.user.findFirst()
    //   // 3
    //  expect(status).toBe(200)
    //   // 4
    //  expect(newUser).not.toBeNull()
    //   // 5
    //  expect(body.user).toStrictEqual({
    //     username: 'testusername',
    //     id: newUser?.id
    //  })
    // })

    it("should respond with a `200` status code and user details", async () => {
      const { status, body } = await request(app).post("/auth/signup").send({
        email: "student@gmail.com",
        password: "P@ssw0rd",
        fullname: "Student",
      })
    })
  })
})
