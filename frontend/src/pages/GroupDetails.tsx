import { axiosInstanceWithAuth } from "@/api/Axios";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import ProjectCard from "@/components/ProjectsComponents/ProjectCard";

interface Details {
  id: number,
  groupName: string,
  description: string,
}

interface Project {
  id: number;
  name: string;
  description: string;
}


const stubSkills = "Python, Java, C, C++, C#, JavaScript";

const getStubSkills = () => {
  return stubSkills;
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
      const response = await axiosInstanceWithAuth.post("/group/get-reccs", {
        prompt: getStubSkills(),
      })
      console.log(response.data);
    }

    fetchDetails();
    getReccs();
  },[groupId])

  const navigate = useNavigate();
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
        {/* <Carousel className="h-full mt-5 w-full max-w-[95%] mx-auto" opts={{
          align: "start"
        }}>
          <CarouselContent>
            {recc.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel> */}
      </div>    
    </>
  )
}

export default GroupDetails