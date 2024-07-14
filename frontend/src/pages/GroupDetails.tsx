import { axiosInstanceWithAuth } from "@/api/Axios";
import ProjectCard from "@/components/ProjectComponents/ProjectCard";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

interface Details {
  id: number,
  groupName: string,
  description: string,
}

const stubSkills = "Python, Java, C, C++, C#, JavaScript";

const projectRequirements = new Map<string, string>([
  ["Project 1", "network protocols (HTTP, FTP, SMTP, etc.), network security (firewalls, VPNs, encryption), socket programming, wireless networking, cloud computing (AWS, Azure, Google Cloud)"],
  ["Project 2", "WebSockets, relational databases (MySQL, PostgreSQL), NoSQL databases (MongoDB, Cassandra), data modeling, SQL querying, database normalization, indexing, optimization, transactions, concurrency control, database administration, data warehousing, big data technologies (Hadoop, Spark)"],
  ["Project 3", "Python, Java, C, C++, C#, JavaScript"],
  ["Project 4", "malware analysis, digital forensics, machine learning algorithms, deep learning, natural language processing (NLP), computer vision, reinforcement learning, neural networks, data preprocessing, model evaluation, tuning, AI ethics"],
  ["Project 5", "data cleaning, predictive modeling, time series analysis, big data processing, business intelligence, data storytelling, R programming"],
  ["Project 6", "DevOps practices, debugging, troubleshooting, software architecture, HTML, CSS, frontend frameworks (React, Angular, Vue.js), backend frameworks (Node.js, Django, Flask, Ruby on Rails), RESTful API design"],
  ["Project 7", "Ruby, PHP, Swift, Go, Kotlin, Rust, TypeScript, SQL"],
  ["Project 8", "public speaking, project management, critical thinking, problem-solving, time management, team collaboration, ethical considerations in technology, innovation, creativity, continuous learning, adaptability"],
  ["Project 9", "process management, threading, concurrency, memory management, file systems, I/O systems"]
]);

const projectsToString = () => {
  let string = "";
  projectRequirements.forEach((value, key) => {
    string += `${key}: ${value}\n`;
  });
  return string;
}

const generatePrompt = () => {
  return `You are a member of a group that has the following skills: ${stubSkills}. You are looking for projects to do. Here are the list of projects that you can work on:\n${projectsToString()}. Recommend a project that you think is suitable based on their current skills. Format them with the project name only separated by commas. For example, "Project 1".`;
}

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [details, setDetails] = useState<Details>({
    id: 0,
    groupName: "",
    description: "",
  });

  const [recc, setRecc] = useState<string[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`, {
        data: {
          groupId: groupId,
        }
      })
      setDetails(response.data);
    }

    const getReccs = async () => {
      const response = await axiosInstanceWithAuth.post("/group/stub", {
        prompt: generatePrompt(),
      })
      const textOutput = response.data;
      const formatted = textOutput.split(",")
      setRecc(formatted);
    }

    fetchDetails();
    getReccs();
  },[])

  return (
    <>
      <div className="px-14 py-5">
        <p className="mt-8 text-2xl font-bold mb-5">{`GroupDetails for ${groupId}`}</p>
        <div className="mb-5">
          <p className="mb-2">
            {`GroupId: `}
            <span className="font-bold">
            {`${groupId}`}
            </span>
          </p>
          <p>
            {`Group Name : `}
            <span className="font-bold">
              {`${details.groupName}`}
            </span>
          </p>
          <p className="font-bold mt-5">Group Description:</p>
          <p>{`${details.description}`}</p>
          <p className="font-bold">Group Skills:</p>

          <p className="mt-5">----------------- STUB ------------------</p>
          <p>Currently, this group has the combined skills of:</p>
          <p>{stubSkills}</p>
        </div>
        
        <p className="mt-10 text-2xl font-bold mb-5">{`Recommended Projects`}</p>
        <Carousel className="h-full mt-5 w-full max-w-[95%] mx-auto" opts={{
          align: "start"
        }}>
          <CarouselContent>
            {recc.map(project => (
              <ProjectCard id={project} inCarousel={true} />
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>    
    </>
  )
}

export default GroupDetails