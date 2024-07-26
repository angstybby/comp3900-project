import { useProfile } from "@/contexts/ProfileContext";
import { useCallback, useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditProjectModal from "@/components/Modals/EditProjectModal";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import LoadingCircle from "@/components/LoadingCircle";

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
    groups: []
  });
  const [userInGroup, setUserInGroup] = useState(false);

  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

  const isProjectOwner = projectDetail?.ProjectOwner.zid === profileData.zid;

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      setProjectDetail(response.data);
      const response2 = await axiosInstanceWithAuth.get(`/projects/user-in-group/${profileData.zid}/${projectId}`);
      setUserInGroup(response2.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId, profileData.zid]);

  useEffect(() => {
    if (profileData) {
      fetchProjectDetails();
      console.log(projectDetail);
    }
  }, [fetchProjectDetails, profileData]);

  const openEditModal = () => {
    setEditProjectModalOpen(true);
  };

  const closeEditModal = () => {
    setEditProjectModalOpen(false);
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingCircle />
      </div>
    );
  }


  return (
    <>
      <EditProjectModal open={editProjectModalOpen} close={closeEditModal} refetchData={fetchProjectDetails} initValues={projectDetail} />
      <div className="p-14">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-medium">{projectDetail?.title}</h1>
            <p className="mt-4 text-lg">Project Owner: {projectDetail?.ProjectOwner.zid}</p>
          </div>
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
          <SkillsGapAnalysis projectId={Number(projectId)} />
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsOther;
