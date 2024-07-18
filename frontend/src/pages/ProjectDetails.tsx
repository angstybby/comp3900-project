import { useProfile } from "@/contexts/ProfileContext";
import { useCallback, useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Details, Project } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditProjectModal from "@/components/Modals/EditProjectModal";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import ApplyProjectConfirmationModal from "@/components/Modals/ApplyProjectConfirmation";

const ProjectDetails = () => {
  const { groupId, projectId } = useParams();
  const { profileData } = useProfile();

  const [projectDetail, setProjectDetail] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    skills: [],
    ProjectOwner: {
      zid: "",
    }
  });
  const [groupDetail, setGroupDetail] = useState<Details>({
    id: 0,
    groupName: "",
    description: "",
    groupOwnerId: "",
    members: 0,
    MaxMembers: 0,
    groupOwnerName: "",
    CombinedSkills: [],
    Project: []
  });

  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [confirmApplyProjectModalOpen, setConfirmApplyProjectModalOpen] = useState(false);
  const [projectInGroup, setProjectInGroup] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);

  const isProjectOwner = projectDetail?.ProjectOwner.zid === profileData.zid;

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      setProjectDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId]);

  const fetchGroupDetails = useCallback(async () => {
    console.log(groupId)
    try {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`);
      const skills = response.data.CombinedSkills.map((skill: { skillName: string }) => skill.skillName);
      response.data.CombinedSkills = skills;
      setGroupDetail(response.data);

      const projectGroup = response.data.Project.some((project: { id: number }) => project.id === projectDetail.id);
      setProjectInGroup(projectGroup);
      console.log(projectGroup);

      const groupOwner = response.data.groupOwnerId === profileData.zid;
      setIsGroupOwner(groupOwner);


    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  }, [groupId]);

  useEffect(() => {
    fetchProjectDetails();
    fetchGroupDetails();
  }, []);

  const openEditModal = () => {
    setEditProjectModalOpen(true);
  };

  const closeEditModal = () => {
    setEditProjectModalOpen(false);
  };

  const openApplyProjectModal = () => {
    setConfirmApplyProjectModalOpen(true);
  }

  const closeApplyProjectModal = () => {
    setConfirmApplyProjectModalOpen(false);
  }

  return (
    <>
      <ApplyProjectConfirmationModal open={confirmApplyProjectModalOpen} close={closeApplyProjectModal} group={groupDetail} project={projectDetail} refetchData={fetchProjectDetails} />
      <EditProjectModal open={editProjectModalOpen} close={closeEditModal} refetchData={fetchProjectDetails} initValues={projectDetail} />
      <div className="p-14">
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{projectDetail?.title}</h1>
          {isProjectOwner ? (
            <div className="flex flex-row gap-5">
              <ButtonUtility text="Edit Project" onClick={openEditModal} />
              <ButtonPrimary classname="bg-orange-600 hover:bg-orange-800" text="Group Applications" url={`/project/${projectDetail.id}/applications`} />
            </div>
          ) : (
            isGroupOwner && (
              <div>
                {projectInGroup ? (
                  <ButtonUtility text="Leave Project" onClick={() => { }} />
                ) : (
                  <ButtonUtility text="Apply for Project" onClick={openApplyProjectModal} />
                )}
              </div>
            )
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

export default ProjectDetails;
