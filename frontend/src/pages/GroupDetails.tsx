import { axiosInstanceWithAuth } from "@/api/Axios";
import ProjectCard from "@/components/ProjectsComponents/ProjectCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

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

  const [recc, setRecc] = useState<string[]>(["1", "2", "3", "4", "5"]);

  const stubProject = {
    id: 1,
    name: "Stub Project",
    description: "This is a stub project",
  }

  const handleClickProject = () => {
    // navigate(`/project/${project.id}`);
  }

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

    // const getReccs = async () => {
    //   const response = await axiosInstanceWithAuth.post("/group/get-reccs", {
    //     prompt: getStubSkills(),
    //   })
    //   console.log(response.data);
    // }

    fetchDetails();
    // getReccs();
  }, [groupId])

  const navigate = useNavigate();
  return (

    <>
      <div className="p-14">
        <p className="text-4xl font-normal">Group Details for <span className="font-bold">{details.groupName}</span></p>
        <div className="mb-5">
          <p className="font-normal mt-5 text-gray-500">Group Owner: <span className="font-bold text-black">{details.groupOwnerName} ({details.groupOwnerId})</span></p>
          <p className="font-normal text-gray-500">Group Description: <span className="text-black">{`${details.description}`}</span></p>
          <p className="font-normal text-gray-500">Group Skills:</p>

          {/* <p className="mt-5">----------------- STUB ------------------</p>
          <p>Currently, this group has the combined skills of:</p>
          <p>{stubSkills}</p> */}
        </div>

        <p className="mt-10 text-2xl font-bold mb-5">{`Recommended Projects`}</p>
        {/* {recc.map(project => (
          <ProjectCard project={i} inCarousel={false} />
        ))} */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <ProjectCard project={stubProject} onClick={handleClickProject} />
          <ProjectCard project={stubProject} onClick={handleClickProject} />
          <ProjectCard project={stubProject} onClick={handleClickProject} />
          <ProjectCard project={stubProject} onClick={handleClickProject} />
          <ProjectCard project={stubProject} onClick={handleClickProject} />
          <ProjectCard project={stubProject} onClick={handleClickProject} />
        </div>
      </div >
    </>
  )
}

export default GroupDetails