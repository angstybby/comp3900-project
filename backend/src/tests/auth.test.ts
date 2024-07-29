// src/tests/auth.test.ts
import { describe, expect, it, test } from "vitest";
import prisma from "./helpers/prisma";
import request from "supertest";
import app from "../../app";
import { UserType } from "@prisma/client";
import { sha256 } from "js-sha256";

describe("/auth", async () => {
    describe("[POST] /auth/register", () => {
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
            const zid = "z1111111";
            const email = "student@gmail.com";
            const password = "P@ssw0rd";
            const fullname = "Student";
            const userType = UserType.student;

            const { status, headers } = await request(app)
                .post("/api/auth/register")
                .send({
                    zid,
                    email,
                    password,
                    fullname,
                    userType,
                });

            const newUser = await prisma.user.findFirst({
                where: {
                    zid,
                    email,
                    userType,
                },
            });

            const newProfile = await prisma.profile.findFirst({
                where: {
                    zid,
                    fullname,
                },
            });

            expect(status).toBe(200);
            // Do not need to check as it should already equal by search query
            expect(newUser).not.toBeNull();
            expect(newProfile).not.toBeNull();
            expect(newUser?.password === sha256(password));

            const cookies = headers['set-cookie'];
            expect(cookies).toBeDefined();
            
        });
    });
});
