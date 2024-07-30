import { UserType } from "@prisma/client";
import { beforeAll, beforeEach, describe, expect, it, test } from "vitest";
import prisma from "./helpers/prisma";
import request from "supertest";
import app from "../../app";
import { sign } from "jsonwebtoken";
import { JwtUser } from "../models/auth.models";

describe("/course", async () => {
    const studentOneZid = "z1111111";
    const studentOneEmail = "student@gmail.com";
    const studentOnePassword = "P@ssw0rd";
    const studentOneFullname = "Student";
    const studentUserType = UserType.student;

    let jwt_token: string;

    beforeEach(async () => {
        await prisma.user.create({
            data: {
                zid: studentOneZid,
                email: studentOneEmail,
                password: studentOnePassword,
                userType: studentUserType,
            },
        });
        await prisma.profile.create({
            data: {
                profileOwner: {
                    connect: {
                        zid: studentOneZid,
                    },
                },
                fullname: studentOneFullname,
            },
        });

        const jwtUser: JwtUser = {
            zid: studentOneZid,
            email: studentOneEmail,
            fullname: studentOneFullname,
            userType: studentUserType,
        };

        if (!process.env.JWT_HASH) {
            throw new Error("JWT_HASH is not defined");
        }

        jwt_token = sign(jwtUser, process.env.JWT_HASH, { expiresIn: "1h" });
    });

    describe("[POST] /course/search", async () => {
        it("should return 200 and an array of courses", async () => {
            const response = await request(app)
                .post("/api/course/search")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    name: "COMP",
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(10);
        });

        it("should return 200 and a specific course", async () => {
            const response = await request(app)
                .post("/api/course/search")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    name: "COMP6771",
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].id).toBe("COMP6771");
        });
    });

    describe("[POST] /course/add", async () => {
        it("should return 200 and a success message", async () => {
            const response = await request(app)
                .post("/api/course/add")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    id: "COMP6771",
                });
            expect(response.status).toBe(200);

            // Checks the db
            const course = await prisma.courseTaken.findUnique({
                where: {
                    zid_courseId: {
                        zid: studentOneZid,
                        courseId: "COMP6771",
                    },
                },
            });
            expect(course).not.toBeNull();
        });

        it("should return 400 and an error message", async () => {
            const response = await request(app)
                .post("/api/course/add")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    id: "COMP6772",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("[POST] /course/delete", async () => {
        it("should return 200 and a success message", async () => {
            await prisma.courseTaken.create({
                data: {
                    zid: studentOneZid,
                    courseId: "COMP6771",
                },
            });

            const response = await request(app)
                .delete("/api/course/delete")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    course: "COMP6771",
                });
            expect(response.status).toBe(200);

            // Checks the db
            const course = await prisma.courseTaken.findUnique({
                where: {
                    zid_courseId: {
                        zid: studentOneZid,
                        courseId: "COMP6771",
                    },
                },
            });
            expect(course).toBeNull();
        });

        it("should return 400 and an error message", async () => {
            const response = await request(app)
                .post("/api/course/delete")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    id: "COMP6772",
                });
            expect(response.status).toBe(400);
        });
    });
});
