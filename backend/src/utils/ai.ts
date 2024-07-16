import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

export const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const getCompletedCourseContext =
    "Course codes are labelled by <ABCD> <1234> and then followed by their title. <ABCD> can be any combination of letters and <1234> can be a combination of numbers. Example is COMP 2501. Given this, list all the courses that are mentioned and have grades alongside them. Only return their course codes and discard their title, also remove the space in between.";

export const summarizeCourseOutlineContext =
    "You are given the contents of a course outline. Summarize the course to one paragraph in English, at most 150 words. Refer to course codes using the pattern ABCD1234.";

export const getCourseSkillsContext =
    'You are given the contents of a course outline. List the skills learned when completing this course. List the skills 1-3 words each. Skills should be in this format "- Skill 1 - Skill 2 - Skill 3 " and so on. The skills that you should pick from is provided is the following: Python, Java, C, C++, C#, JavaScript, Ruby, PHP, Swift, Go, Kotlin, Rust, TypeScript, SQL, sorting algorithms, search algorithms, graph algorithms, dynamic programming, greedy algorithms, divide and conquer, trees and binary trees, hash tables, heaps, linked lists, stacks, queues, object-oriented programming (OOP), functional programming, design patterns, test-driven development (TDD), continuous integration/continuous deployment (CI/CD), version control (Git), Agile methodologies, DevOps practices, debugging, troubleshooting, software architecture, HTML, CSS, frontend frameworks (React, Angular, Vue.js), backend frameworks (Node.js, Django, Flask, Ruby on Rails), RESTful API design, GraphQL, web security (XSS, CSRF, etc.), responsive design, web performance optimization, content management systems (WordPress, Joomla), WebSockets, relational databases (MySQL, PostgreSQL), NoSQL databases (MongoDB, Cassandra), data modeling, SQL querying, database normalization, indexing, optimization, transactions, concurrency control, database administration, data warehousing, big data technologies (Hadoop, Spark), process management, threading, concurrency, memory management, file systems, I/O systems, security, access control, virtualization, system calls, APIs, kernel development, scripting (Bash, PowerShell), TCP/IP stack, network protocols (HTTP, FTP, SMTP, etc.), network security (firewalls, VPNs, encryption), socket programming, wireless networking, cloud computing (AWS, Azure, Google Cloud), network architecture, load balancing, network troubleshooting, DNS, domain management, cryptography, network security, application security, penetration testing, security protocols, ethical hacking, incident response, security risk management, malware analysis, digital forensics, machine learning algorithms, deep learning, natural language processing (NLP), computer vision, reinforcement learning, neural networks, data preprocessing, model evaluation, tuning, AI ethics, frameworks (TensorFlow, PyTorch, Scikit-learn), data mining, statistical analysis, data visualization (Tableau, Power BI), data cleaning, predictive modeling, time series analysis, big data processing, business intelligence, data storytelling, R programming, user interface (UI) design, user experience (UX) design, usability testing, interaction design, accessibility standards, prototyping tools (Figma, Sketch), human factors, cognitive psychology, visual design principles, information architecture, microcontrollers (Arduino, Raspberry Pi), real-time operating systems (RTOS), firmware development, hardware-software integration, IoT devices, sensor interfacing, embedded C programming, digital signal processing (DSP), power management, embedded networking (CAN, I2C, SPI), automata theory, formal languages, Turing machines, computability, complexity classes (P, NP, NP-complete), reductions, completeness, algorithmic information theory, quantum computing basics, lambda calculus, recursive functions, technical writing, public speaking, project management, critical thinking, problem-solving, time management, team collaboration, ethical considerations in technology, innovation, creativity, continuous learning, adaptability. Dont need to say anything else just say the skills';
