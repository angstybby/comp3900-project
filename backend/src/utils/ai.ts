import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
export const AIModel = genAI.getGenerativeModel({ model: 'gemini-pro'}); 

export const getCompletedCourseContext = "Course codes are labelled by <ABCD> <1234> and then followed by their title. <ABCD> can be any combination of letters and <1234> can be a combination of numbers. Example is COMP 2501. Given this, list all the courses that are mentioned and have grades alongside them. Only return their course codes and discard their title, also remove the space in between."

export const summarizeCourseOutlineContext = "You are given the contents of a course outline. Summarize the course to one paragraph in English, at most 150 words. Refer to course codes using the pattern ABCD1234."

export const getCourseSkillsContext = "You are given the contents of a course outline. List the skills learned when completing this course. List the skills 1-3 words each. Skills should be in this format \"- Skill 1 - Skill 2 - Skill 3 \" and so on."