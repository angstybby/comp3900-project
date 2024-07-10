import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Hide API KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
export const AIModel = genAI.getGenerativeModel({ model: 'gemini-pro'}); 

export const promptContext = "Course codes are labelled by <ABCD> <1234> and then followed by their title. <ABCD> can be any combination of letters and <1234> can be a combination of numbers. Example is COMP 2501. Given this, list all the courses that are mentioned and have grades alongside them. Only return their course codes and discard their title, also remove the space in between."