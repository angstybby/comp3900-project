import { useProfile } from "@/contexts/ProfileContext";
import { useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditProjectModal from "@/components/Modals/EditProjectModal";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { profileData } = useProfile();
  const [project, setProject] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    skills: [],
    ProjectOwner: {
      zid: "",
    }
  });
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);


  useEffect(() => {
    if (profileData.zid) {
      // to fetch student's data
    }
  })

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      console.log(response.data);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const isProjectOwner = project?.ProjectOwner.zid === profileData.zid;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  return (
    <>
      <EditProjectModal open={editProjectModalOpen} close={() => setEditProjectModalOpen(false)} refetchData={fetchProjectDetails} initValues={project} />
      <div className="p-14">
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{project?.title}</h1>
          {isProjectOwner && (
            <div className="flex flex-row gap-5">
              <ButtonUtility text="Edit Project" onClick={() => setEditProjectModalOpen(true)} />
              <ButtonPrimary classname="bg-orange-600 hover:bg-orange-800" text="Group Applications" url={`/project/${project.id}/applications`} />
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-medium">Description</h2>
          <p className="mt-4 text-lg">{project?.description}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-medium">Skills Gap Analysis</h2>
          <SkillsGapAnalysis />
        </div>
      </div>
    </>
  )
}

export default ProjectDetails