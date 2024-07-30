// src/tests/auth.test.ts
import { beforeAll, beforeEach, describe, expect, it, test } from "vitest";
import prisma from "./helpers/prisma";
import request from "supertest";
import app from "../../app";
import { UserType } from "@prisma/client";
import { sha256 } from "js-sha256";
import { verify } from "jsonwebtoken";

describe("/auth", async () => {
    const studentOneZid = "z1111111";
    const studentOneEmail = "student@gmail.com";
    const studentOnePassword = "P@ssw0rd";
    const studentOneFullname = "Student";
    const studentUserType = UserType.student;

    const studentTwoZid = "z2222222";
    const studentTwoEmail = "student2@gmail.com";
    const studentTwoPassword = "P@ssw0rd";
    const studentFullName = "Student Two";

    const academicOneZid = "z3333333";
    const academicOneEmail = "academic@gmail.com";
    const academicOnePassword = "P@ssw0rd";
    const academicOneFullname = "Academic";
    const academicUserType = UserType.academic;

    describe("[POST] /auth/register", async () => {
        it("should respond with a `200` status code and JWT token", async () => {
            const { status, headers } = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentTwoZid,
                    email: studentTwoEmail,
                    password: studentTwoPassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            const newUser = await prisma.user.findFirst({
                where: {
                    zid: studentTwoZid,
                    email: studentTwoEmail,
                    userType: studentUserType,
                },
            });

            console.log("foo", await prisma.user.findMany({}));

            const newProfile = await prisma.profile.findFirst({
                where: {
                    zid: studentTwoZid,
                    fullname: studentOneFullname,
                },
            });

            expect(status).toBe(200);
            // Do not need to check as it should already equal by search query
            expect(newUser).not.toBeNull();
            expect(newProfile).not.toBeNull();
            expect(newUser?.password === sha256(studentOnePassword));

            const cookies = headers["set-cookie"];
            expect(cookies).toBeDefined();

            const jwt = cookies[0].split(";")[0].split("=")[1];
            expect(jwt).toBeDefined();

            if (!process.env.JWT_HASH) {
                throw new Error("JWT_HASH not set");
            }

            const token = verify(jwt, process.env.JWT_HASH);
            expect(token).toBeDefined();
        });

        it("should respons with `200` status code and JWT token for academic", async () => {
            const { status, headers } = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: academicOneZid,
                    email: academicOneEmail,
                    password: academicOnePassword,
                    fullname: academicOneFullname,
                    userType: academicUserType,
                });

            const newUser = await prisma.user.findFirst({
                where: {
                    zid: academicOneZid,
                    email: academicOneEmail,
                    userType: academicUserType,
                },
            });

            const newProfile = await prisma.profile.findFirst({
                where: {
                    zid: academicOneZid,
                    fullname: academicOneFullname,
                },
            });

            expect(status).toBe(200);
            // Do not need to check as it should already equal by search query
            expect(newUser).not.toBeNull();
            expect(newProfile).not.toBeNull();
            expect(newUser?.password === sha256(studentOnePassword));

            const cookies = headers["set-cookie"];
            expect(cookies).toBeDefined();

            const jwt = cookies[0].split(";")[0].split("=")[1];
            expect(jwt).toBeDefined();

            if (!process.env.JWT_HASH) {
                throw new Error("JWT_HASH not set");
            }

            const token = verify(jwt, process.env.JWT_HASH);

            expect(token).toBeDefined();
        });

        it("should respond with a `409` status code if email or zid is already in use", async () => {
            const responseOne = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentOneZid,
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });
            expect(responseOne.status).toBe(200);

            const responseTwo = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentOneZid,
                    email: studentTwoEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            expect(responseTwo.status).toBe(409);

            const responseThree = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentTwoZid,
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            expect(responseThree.status).toBe(409);
        });

        it("should respond with a `400` status code if some details are missing", async () => {
            // Missing userType
            const responseOne = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentOneZid,
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                });

            expect(responseOne.status).toBe(400);

            const responseTwo = await request(app)
                .post("/api/auth/register")
                .send({
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            expect(responseTwo.status).toBe(400);
        });
    });

    describe("[POST] /auth/login", async () => {
        // Assuming dbAddUser is a function that adds a user to your mock database
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send({
                zid: studentOneZid,
                email: studentOneEmail,
                password: studentOnePassword,
                fullname: studentOneFullname,
                userType: studentUserType,
            });

            await request(app).post("/api/auth/register").send({
                zid: academicOneZid,
                email: academicOneEmail,
                password: academicOnePassword,
                fullname: academicOneFullname,
                userType: academicUserType,
            });
        });

        it("should log in student successfully with correct credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: studentOneEmail,
                password: studentOnePassword,
            });

            expect(response.status).toBe(200);
            expect(response.headers["set-cookie"]).toBeDefined();

            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();

            const jwt = cookies[0].split(";")[0].split("=")[1];
            expect(jwt).toBeDefined();

            if (!process.env.JWT_HASH) {
                throw new Error("JWT_HASH not set");
            }

            const token = verify(jwt, process.env.JWT_HASH);
            expect(token).toBeDefined();
        });

        it("should log in academic successfully with correct credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: academicOneEmail,
                password: academicOnePassword,
            });

            expect(response.status).toBe(200);
            expect(response.headers["set-cookie"]).toBeDefined();

            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();

            const jwt = cookies[0].split(";")[0].split("=")[1];
            expect(jwt).toBeDefined();

            if (!process.env.JWT_HASH) {
                throw new Error("JWT_HASH not set");
            }

            const token = verify(jwt, process.env.JWT_HASH);
            expect(token).toBeDefined();
        });

        it("should fail login with incorrect password", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: studentOneEmail,
                password: "wrongpassword",
            });

            expect(response.status).toBe(400);
            expect(response.text).toContain("Email or password is incorrect");
        });

        it("should fail login with incorrect email", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "nonexistent@example.com",
                password: studentOnePassword,
            });

            expect(response.status).toBe(400);
        });

        it("should return an error for missing email", async () => {
            const response = await request(app).post("/api/auth/login").send({
                password: studentOnePassword,
            });

            expect(response.status).toBe(400);
        });

        it("should return an error for missing password", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: studentOneEmail,
            });

            expect(response.status).toBe(400);
        });

        it("should handle invalid email format", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "bademail",
                password: studentOnePassword,
            });

            expect(response.status).toBe(400);
        });
    });

    describe("[ALL] Auth Middleware", async () => {
        it("should return a 401 status code if no token is provided", async () => {
            const response = await request(app).get("/api/profile/");
            expect(response.status).toBe(401);
        });

        it("should return a 401 status code if token is invalid", async () => {
            const response = await request(app)
                .get("/api/profile/")
                .set("Authorization", "Bearer invalidtoken");

            expect(response.status).toBe(401);
        });

        it("should return a 200 status code if token is valid", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentOneZid,
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            const cookies = response.headers["set-cookie"];
            console.log(response);
            const jwt = cookies[0].split(";")[0].split("=")[1];

            const meResponse = await request(app)
                .get("/api/profile/")
                .set("Authorization", `Bearer ${jwt}`);

            expect(meResponse.status).toBe(200);
        });
    });
});
