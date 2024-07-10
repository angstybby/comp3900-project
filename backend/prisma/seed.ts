import { PrismaClient } from "@prisma/client";
import courseDataJson from "../src/data/courseCodesAndTitle.json";

const prisma = new PrismaClient();
const seedCourses = async () => {
  const courseData = courseDataJson;
  for (const course of courseData) {
    const courseCode = course.Code;
    const courseTitle = course.Title;
    console.log(`Seeding ${courseCode}-${courseTitle}`)
    const stubSkills = [""];
    await prisma.course.create({
      data: {
        id: courseCode,
        courseName: courseTitle,
        skills: stubSkills 
      },
    })
  }
}

seedCourses()
  .then(() => {
    console.log("Done");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  })