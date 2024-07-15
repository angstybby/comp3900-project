import { axiosInstanceWithAuth } from "@/api/Axios";
import ProjectCard from "@/components/ProjectComponents/ProjectCard";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

interface Details {
  id: number,
  groupName: string,
  description: string,
  groupOwnerId: string,
  members: number,
  MaxMembers: number
  groupOwnerName: string
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
    groupOwnerId: "",
    members: 0,
    MaxMembers: 0,
    groupOwnerName: ""
  });

  const [recc, setRecc] = useState<string[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`, {
        data: {
          groupId: groupId,
        }
      })
      console.log(response.data);
      setDetails(response.data);
    }
<<<<<<< Updated upstream

    const getReccs = async () => {
      const response = await axiosInstanceWithAuth.post("/group/get-reccs", {
        prompt: getStubSkills(),
      })
      console.log(response.data);
    }

    fetchDetails();
    getReccs();
  },[groupId])
=======
    // const getReccs = async () => {
    //   const response = await axiosInstanceWithAuth.post("/group/stub", {
    //     prompt: generatePrompt(),
    //   })
    //   const textOutput = response.data;
    //   const formatted = textOutput.replace(/\*\* /g, "\n\n");
    //   setRecc(formatted);
    // }

    fetchDetails();
    console.log(details);
    // getReccs();
  }, [])
>>>>>>> Stashed changes

  return (
    <>
      <div className="p-14">
        <p className="text-4xl font-normal">Group Details for <span className="font-bold">{details.groupName}</span></p>
        <div className="mb-5">
          <p className="font-normal mt-5">Group Owner: <span className="font-bold">{details.groupOwnerName} ({details.groupOwnerId})</span></p>
          <p>{`${details.description}`}</p>
          <p className="font-bold">Group Skills:</p>

          <p className="mt-5">----------------- STUB ------------------</p>
          <p>Currently, this group has the combined skills of:</p>
          <p>{stubSkills}</p>
        </div>
<<<<<<< Updated upstream
        
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
=======

        {/* <p className="mt-10 text-2xl font-bold mb-5">{`Recommended Projects`}</p>
        <p>{recc}</p> */}
      </div>
>>>>>>> Stashed changes
    </>
  )
}

export default GroupDetails