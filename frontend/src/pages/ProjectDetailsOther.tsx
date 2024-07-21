import { useProfile } from "@/contexts/ProfileContext";
import { useCallback, useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditProjectModal from "@/components/Modals/EditProjectModal";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";

const ProjectDetailsOther = () => {
  const { projectId } = useParams();
  const { profileData } = useProfile();

  const [projectDetail, setProjectDetail] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    skills: [],
    ProjectOwner: {
      zid: "",
    },
    ProjectInterest: [],
  });

  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

  const isProjectOwner = projectDetail?.ProjectOwner.zid === profileData.zid;

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      setProjectDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
    console.log(projectDetail);
  }, [fetchProjectDetails]);

  const openEditModal = () => {
    setEditProjectModalOpen(true);
  };

  const closeEditModal = () => {
    setEditProjectModalOpen(false);
  };


  return (
    <>
      <EditProjectModal open={editProjectModalOpen} close={closeEditModal} refetchData={fetchProjectDetails} initValues={projectDetail} />
      <div className="p-14">
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{projectDetail?.title}</h1>
          {isProjectOwner && (
            <div className="flex flex-row gap-5">
              <ButtonUtility text="Edit Project" onClick={openEditModal} />
              <ButtonPrimary classname="bg-orange-600 hover:bg-orange-800" text="Group Applications" url={`/project/${projectDetail.id}/applications`} />
            </div>
          )}

        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-medium">Description</h2>
          <p className="mt-4 text-lg">{projectDetail?.description}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-medium">Skills Gap Analysis</h2>
          <SkillsGapAnalysis />
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsOther;
