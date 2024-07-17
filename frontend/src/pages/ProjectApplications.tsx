import { useProfile } from "@/contexts/ProfileContext";
import { useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditProjectModal from "@/components/Modals/EditProjectModal";

const ProjectApplications = () => {
  const [groupApps, setGroupApps] = useState([]);
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
        </div>
      </div>
    </>
  )
}

export default ProjectApplications