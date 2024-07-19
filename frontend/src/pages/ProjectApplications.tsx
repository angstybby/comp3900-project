import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import Bubble from "@/components/SkillsComponents/BubbleSkills";
import ButtonUtility from "@/components/Buttons/ButtonUtility";

interface Group {
  id: number;
  groupName: string;
  description: string;
  groupOwnerId: string;
  MaxMembers: number;
  CombinedSkills: Skill[];
  projectInterests: string[];
}

interface Skill {
  skillName: string
}

interface GroupApplication {
  group: Group;
  groupId: number;
  projectId: number;
  status: string;
  createdAt: string;
}

const ProjectApplications = () => {
  const [groupApps, setGroupApps] = useState<GroupApplication[]>([]);
  const { projectId } = useParams<{ projectId: string }>();

  const fetchProjectApps = async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/applications/${projectId}`);
      console.log(response.data);
      setGroupApps(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  useEffect(() => {
    fetchProjectApps();
  }, [projectId]);

  return (
    <>
      <div className="h-screen flex justify-center">
        <div className="w-[95%] flex flex-col p-14">
          <div className="w-full mx-auto flex flex-row justify-between">
            <h1 className="text-4xl font-medium pb-8">
              Group Applications for Project
            </h1>
          </div>
          <div className="w-full mx-auto">
            <div className="flex flex-col w-full">
              {groupApps.length === 0 ? (
                <div className="flex justify-center my-5 w-full">
                  <p className="text-2xl font-bold">No applications found</p>
                </div>
              ) : (
                groupApps.map((app, index) => (
                  <div key={index} className="flex flex-col w-full bg-gray-100 shadow-lg rounded-md p-5 my-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-medium">{app.group.groupName}</h2>
                        <div className="flex flex-row gap-3">
                          <ButtonUtility text="Accept" classname="bg-green-500 hover:bg-green-600" onClick={() => { }} />
                          <ButtonUtility text="Reject" classname="bg-red-500 hover:bg-red-600" onClick={() => { }} />
                        </div>
                      </div>
                      <p className="text-lg">{app.group.description}</p>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-bold mb-2">Skills:</h3>
                      <div className="flex flex-row flex-wrap">
                        {app.group.CombinedSkills.map((skill, skillIndex) => (
                          <Bubble key={skillIndex} text={skill.skillName} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default ProjectApplications