import { PrismaClient } from "@prisma/client";
import courseDataJson from "../src/data/courseCodesAndTitle.json";

const prisma = new PrismaClient();
const seedCourses = async () => {
  const courseData = courseDataJson;

  // Only do this when the database in completely reset
  if (courseData.length > 0) {
    await prisma.course.createMany({
      data: courseData.map(course => ({
        id: course.Code,
        courseName: course.Title
      }))
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