// src/tests/auth.test.ts
import { describe, expect, it, test } from "vitest";
import prisma from "./helpers/prisma";
import request from "supertest";
import app from "../../app";
import { UserType } from "@prisma/client";
import { sha256 } from "js-sha256";

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

    describe("[POST] /auth/register", () => {
        it("should respond with a `200` status code and JWT token", async () => {
            const { status, headers } = await request(app)
                .post("/api/auth/register")
                .send({
                    zid: studentOneZid,
                    email: studentOneEmail,
                    password: studentOnePassword,
                    fullname: studentOneFullname,
                    userType: studentUserType,
                });

            const newUser = await prisma.user.findFirst({
                where: {
                    zid: studentOneZid,
                    email: studentOneEmail,
                    userType: studentUserType,
                },
            });

            const newProfile = await prisma.profile.findFirst({
                where: {
                    zid: studentOneZid,
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
});
