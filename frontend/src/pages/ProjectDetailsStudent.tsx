import { useProfile } from "@/contexts/ProfileContext";
import { useCallback, useEffect, useState } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Details, Project, ProjectStatus } from "@/utils/interfaces";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import ApplyProjectConfirmationModal from "@/components/Modals/ApplyProjectConfirmation";

const ProjectDetailsStudent = () => {
  const { groupId, projectId } = useParams();
  const { profileData } = useProfile();

  const [projectDetail, setProjectDetail] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    skills: [],
    ProjectOwner: {
      zid: "",
      fullname: "",
    },
    ProjectInterest: [],
    groups: []
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

  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(null);

  const [confirmApplyProjectModalOpen, setConfirmApplyProjectModalOpen] = useState(false);
  const [projectInGroup, setProjectInGroup] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      setProjectDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId]);

  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`);
      const skills = response.data.CombinedSkills.map((skill: { skillName: string }) => skill.skillName);
      response.data.CombinedSkills = skills;
      setGroupDetail(response.data);

      const projectGroup = response.data.Project.some((project: { id: number }) => project.id === projectDetail.id);
      setProjectInGroup(projectGroup);

      // Check if Project is still pending or rejected
      const projectInterest = response.data.ProjectInterest
        .filter((projectInterest: { projectId: number; }) => projectInterest.projectId === projectDetail.id);

      if (projectInterest.length > 0) {
        setProjectStatus(projectInterest[0].status as ProjectStatus);
      }

      const groupOwner = response.data.groupOwnerId === profileData.zid;
      setIsGroupOwner(groupOwner);


    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  }, [groupId, projectDetail?.id, profileData.zid]);

  useEffect(() => {
    fetchProjectDetails();
    fetchGroupDetails();
    console.log(projectDetail);
    console.log(groupDetail);
  }, [fetchProjectDetails, fetchGroupDetails]);

  const openApplyProjectModal = () => {
    setConfirmApplyProjectModalOpen(true);
  }

  const closeApplyProjectModal = () => {
    setConfirmApplyProjectModalOpen(false);
  }

  return (
    <>
      <ApplyProjectConfirmationModal open={confirmApplyProjectModalOpen} close={closeApplyProjectModal} group={groupDetail} project={projectDetail} refetchData={fetchGroupDetails} />
      <div className="p-14">
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{projectDetail?.title}</h1>
          {isGroupOwner && (
            <div>
              {projectInGroup ? (
                <ButtonUtility text="Leave Project" onClick={() => { }} />
              ) : projectStatus === "PENDING" ? (
                <ButtonUtility
                  classname="disabled:bg-orange-300"
                  disabled={true}
                  text="Application Pending"
                  onClick={() => { }}
                />
              ) : (
                <ButtonUtility text="Apply" onClick={openApplyProjectModal} />
              )}
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

export default ProjectDetailsStudent;
