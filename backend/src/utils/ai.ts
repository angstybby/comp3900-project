import { GoogleGenerativeAI } from "@google/generative-ai";
import SkillsData from "../data/skills.json";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

export const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const getCourseSkillsRatingContext = (
    skillStrings: string[],
    title: string,
    description: string,
) => {
    return `Please analyze the following skills based on the provided course description and give each skill a rating from 1 to 5. Do not add ** ** into the output and do not include explanation on the output.
    
    **Output Format:**
    [Skill 1]: Rating [1-5]
    [Skill 2]: Rating [1-5]
    [Skill 3]: Rating [1-5]
    [Skill 4]: Rating [1-5]
    [Skill 5]: Rating [1-5]
    
    **Example:**
    
    **Course Description:**
    This course focuses on developing advanced communication skills, including public speaking, persuasive writing, and interpersonal communication. Students will engage in practical exercises to enhance their clarity of speech, active listening, and adaptability in various communication settings.
    
    **Skills to Analyze:**
    1. Communication
    2. Public Speaking
    3. Writing
    4. Listening
    5. Adaptability
    
    **Output:**
    Communication: Rating 4
    Public Speaking: Rating 5
    Writing: Rating 3
    Listening: Rating 4
    Adaptability: Rating 4
    
    **Actual Input:**
    
    **Course Description:**
    ${title + ": " + description}
    
    **Skills to Analyze:**
    ${skillStrings.map((skill, index) => `${index}. ${skill} `).join("\n")}
    **Output:**
    `;
};

const skills = SkillsData.skills;

export const getCompletedCourseContext =
    "Course codes are labelled by <ABCD> <1234> and then followed by their title. <ABCD> can be any combination of letters and <1234> can be a combination of numbers. Example is COMP 2501. Given this, list all the courses that are mentioned and have grades alongside them. Only return their course codes and discard their title, also remove the space in between.";

export const summarizeCourseOutlineContext =
    "You are given the contents of a course outline. Summarize the course to one paragraph in English, at most 150 words. Refer to course codes using the pattern ABCD1234.";

export const getCourseSkillsContext = `You are given the contents of a course outline. List the skills learned when completing this course. Skills should be in this format "- Skill 1 - Skill 2 - Skill 3 " and so on. The skills that you should pick from is provided is the following: ${skills.join(
    ",",
)}  If there are additional skills that need to be added as well, add it.Dont need to say anything else just say the skills`;

export const getProjectReccsContext = (skills: string, projects: string) => {
    return `This group currently has these skills: ${skills}. Here are the current existing projects: ${projects}. Based on this set of projects, recommend the three most suitable projects for this group. Format the response as a comma-separated list of project title for example: <title1>, <title2>, <title3>. Do not include explanation and if there are less than three projects, return the available projects.`;
};

export const getStudentReccsContext = (skills: string, students: string) => {
    return `This group currently has these skills: ${skills}. Here are the current existing users: ${students}. Based on this set of users, recommend the three most suitable users for this group. Format the response as a comma-separated list of zid for example: <zid1>, <zid2>, <zid3> and do not include explanations.`;
};

export const getProjectReccsContextByCareer = (skills: string, projects: string, activeProjects: string, career: string) => {
  return `This student currently has these skills: ${skills} and wants to follow this career path: ${career}. Here are the current existing projects: ${projects} and here are the active projects being worked on ${activeProjects}. Based on this set of projects, recommend the three most suitable projects for this student. However if they are already active projects you must not recommended them, and in the worst case leave it blank. You must format the response as a comma-separated list of project titles only, for example: FrontEnd Development, Full-Stack Web Application, Mobile App Development. If there are projects not related at all, please do not recommend them. Also do not include any additional text or explanations.`;
};
