import { UserType } from "@prisma/client";
import { beforeAll, beforeEach, describe, expect, it, test } from "vitest";
import prisma from "./helpers/prisma";
import request from "supertest";
import app from "../../app";
import { sign } from "jsonwebtoken";
import { JwtUser } from "../models/auth.models";
import path from "path";

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

    describe("[DELETE] /course/delete", async () => {
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
                .delete("/api/course/delete")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    course: "COMP6772",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("[POST] /course/searchExc", async () => {
        it("should return 200 no course", async () => {
            await prisma.courseTaken.create({
                data: {
                    zid: studentOneZid,
                    courseId: "COMP6771",
                },
            });

            const response = await request(app)
                .post("/api/course/searchExc")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    name: "COMP6771",
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        it("should return 200 and a specific course", async () => {
            const response = await request(app)
                .post("/api/course/searchExc")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    name: "COMP6771",
                });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].id).toBe("COMP6771");
        });

        it("should return 400", async () => {
            const response = await request(app)
                .post("/api/course/searchExc")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send();
            expect(response.status).toBe(400);
        });
    });

    describe("[GET] /course/user", async () => {
        it("should return 200 and an array of courses", async () => {
            await prisma.courseTaken.createMany({
                data: [
                    {
                        zid: studentOneZid,
                        courseId: "COMP6771",
                    },
                    {
                        zid: studentOneZid,
                        courseId: "COMP6991",
                    },
                    {
                        zid: studentOneZid,
                        courseId: "COMP1521",
                    },
                ],
            });

            const response = await request(app)
                .get("/api/course/user")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);
            expect(response.body[0].course.id).toBe("COMP1521");
            expect(response.body[1].course.id).toBe("COMP6771");
            expect(response.body[2].course.id).toBe("COMP6991");
        });
    });

    describe("[GET] /course/all", async () => {
        it("should return 200 and an array of courses", async () => {
            const response = await request(app)
                .get("/api/course/all")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).greaterThan(10);
        });
    });

    describe("[GET] /course-details/:courseId", async () => {
        it("should return 200 and a specific course", async () => {
            const response = await request(app)
                .get("/api/course/course-details/COMP6771")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body.id).toBe("COMP6771");
        });

        it("should return 400 when invalid course", async () => {
            const response = await request(app)
                .get("/api/course/course-details/COMP6772")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send();
            expect(response.status).toBe(400);
        });
    });

    describe("[POST] /course/update", async () => {
        it("should return 200 and a success message", async () => {
            const response = await request(app)
                .post("/api/course/update-details")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    course: "COMP6771",
                    summary:
                        "This course is about C++ programming and data structures",
                });
            expect(response.status).toBe(200);

            // Checks the db
            const course = await prisma.course.findUnique({
                where: {
                    id: "COMP6771",
                },
            });
            expect(course?.summary).toBe(
                "This course is about C++ programming and data structures",
            );
        });

        it("should return 400 and an error message", async () => {
            const response = await request(app)
                .post("/api/course/update-details")
                .set("Authorization", `Bearer ${jwt_token}`)
                .send({
                    course: "COMP6772",
                    summary:
                        "This course is about C++ programming and data structures",
                });
            expect(response.status).toBe(400);
        });
    });

    // describe("[POST] /generate-skill-rating/:id", async () => {
    //     it("should return 200 and a success message", async () => {
    //         await prisma.course.update({
    //             where: {
    //                 id: "COMP6771",
    //             },
    //             data: {
    //                 summary:
    //                     "COMP6771, Advanced C++ Programming, is a challenging 6-credit postgraduate and undergraduate course at UNSW Sydney. Taught in Term 2 over 10 weeks, the course explores practical aspects of intermediate and advanced C++ programming. Students gain competency in designing, building, and testing C++ programs, utilizing and creating abstractions like data structures and algorithms. The course emphasizes modern C++ practices, including the use of the C++ Standard Library, and prepares students for careers reliant on C++. Assessment includes three individual assignments focusing on different aspects of C++ programming and a final exam held during the UNSW exam period.",
    //             },
    //         });

    //         const response = await request(app)
    //             .post("/api/course/generate-skill-rating/COMP6771")
    //             .set("Authorization", `Bearer ${jwt_token}`)
    //             .send({});

    //         expect(response.status).toBe(200);

    //         // Checks the db
    //         const skills = await prisma.courseSkill.findMany({
    //             where: {
    //                 courseId: "COMP6771",
    //             },
    //         });

    //         expect(skills).toBeInstanceOf(Array);
    //         expect(skills.length).greaterThan(0);
    //     }, 10000);
    // });
});
