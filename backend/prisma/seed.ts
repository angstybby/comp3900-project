import { PrismaClient } from "@prisma/client";
import courseDataJson from "../src/data/courseCodesAndTitle.json";

const prisma = new PrismaClient();
const seedCourses = async () => {
    let courseData = courseDataJson;
    // Only do this when the database in completely reset
    // For the sake of demostrations, we limit the scope of courses to include
    // only COMP courses
    const regex = /COMP[0-9]{4}/;
    courseData = courseData.filter((course) => regex.test(course.Code));
    if (courseData.length > 0) {
        await prisma.course.createMany({
            data: courseData.map((course) => ({
                id: course.Code,
                courseName: course.Title,
            })),
        });
    }
};

const seedSkills = async () => {
    const skills = [
        "Python",
        "Java",
        "C",
        "C++",
        "C#",
        "JavaScript",
        "Ruby",
        "PHP",
        "Swift",
        "Go",
        "Kotlin",
        "Rust",
        "TypeScript",
        "SQL",
        "sorting algorithms",
        "search algorithms",
        "graph algorithms",
        "dynamic programming",
        "greedy algorithms",
        "divide and conquer",
        "trees and binary trees",
        "hash tables",
        "heaps",
        "linked lists",
        "stacks",
        "queues",
        "object-oriented programming (OOP)",
        "functional programming",
        "design patterns",
        "test-driven development (TDD)",
        "continuous integration/continuous deployment (CI/CD)",
        "version control (Git)",
        "Agile methodologies",
        "DevOps practices",
        "debugging",
        "troubleshooting",
        "software architecture",
        "HTML",
        "CSS",
        "frontend frameworks (React, Angular, Vue.js)",
        "backend frameworks (Node.js, Django, Flask, Ruby on Rails)",
        "RESTful API design",
        "GraphQL",
        "web security (XSS, CSRF, etc.)",
        "responsive design",
        "web performance optimization",
        "content management systems (WordPress, Joomla)",
        "WebSockets",
        "relational databases (MySQL, PostgreSQL)",
        "NoSQL databases (MongoDB, Cassandra)",
        "data modeling",
        "SQL querying",
        "database normalization",
        "indexing",
        "optimization",
        "transactions",
        "concurrency control",
        "database administration",
        "data warehousing",
        "big data technologies (Hadoop, Spark)",
        "process management",
        "threading",
        "concurrency",
        "memory management",
        "file systems",
        "I/O systems",
        "security",
        "access control",
        "virtualization",
        "system calls",
        "APIs",
        "kernel development",
        "scripting (Bash, PowerShell)",
        "TCP/IP stack",
        "network protocols (HTTP, FTP, SMTP, etc.)",
        "network security (firewalls, VPNs, encryption)",
        "socket programming",
        "wireless networking",
        "cloud computing (AWS, Azure, Google Cloud)",
        "network architecture",
        "load balancing",
        "network troubleshooting",
        "DNS",
        "domain management",
        "cryptography",
        "network security",
        "application security",
        "penetration testing",
        "security protocols",
        "ethical hacking",
        "incident response",
        "security risk management",
        "malware analysis",
        "digital forensics",
        "machine learning algorithms",
        "deep learning",
        "natural language processing (NLP)",
        "computer vision",
        "reinforcement learning",
        "neural networks",
        "data preprocessing",
        "model evaluation",
        "tuning",
        "AI ethics",
        "frameworks (TensorFlow, PyTorch, Scikit-learn)",
        "data mining",
        "statistical analysis",
        "data visualization (Tableau, Power BI)",
        "data cleaning",
        "predictive modeling",
        "time series analysis",
        "big data processing",
        "business intelligence",
        "data storytelling",
        "R programming",
        "user interface (UI) design",
        "user experience (UX) design",
        "usability testing",
        "interaction design",
        "accessibility standards",
        "prototyping tools (Figma, Sketch)",
        "human factors",
        "cognitive psychology",
        "visual design principles",
        "information architecture",
        "microcontrollers (Arduino, Raspberry Pi)",
        "real-time operating systems (RTOS)",
        "firmware development",
        "hardware-software integration",
        "IoT devices",
        "sensor interfacing",
        "embedded C programming",
        "digital signal processing (DSP)",
        "power management",
        "embedded networking (CAN, I2C, SPI)",
        "automata theory",
        "formal languages",
        "Turing machines",
        "computability",
        "complexity classes (P, NP, NP-complete)",
        "reductions",
        "completeness",
        "algorithmic information theory",
        "quantum computing basics",
        "lambda calculus",
        "recursive functions",
        "technical writing",
        "public speaking",
        "project management",
        "critical thinking",
        "problem-solving",
        "time management",
        "team collaboration",
        "ethical considerations in technology",
        "innovation",
        "creativity",
        "continuous learning",
        "adaptability",
    ];

    if (skills.length > 0) {
        await prisma.skills.createMany({
            data: skills.map((skill) => ({
                skillName: skill,
            })),
        });
    }
};

const seedAdmin = async () => {
    await prisma.user.create({
        data: {
            zid: "z0000000",
            email: "admin@gmail.com",
            userType: "admin",
            password:
                "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            isAdmin: true,
        },
    });

    await prisma.profile.create({
        data: {
            fullname: "Admin",
            profileOwner: {
                connect: {
                    zid: "z0000000",
                },
            },
        },
    });
};

seedAdmin()
    .then(() => {
        console.log("Admin Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });

seedCourses()
    .then(() => {
        console.log("Courses Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });

seedSkills()
    .then(() => {
        console.log("Skills Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
