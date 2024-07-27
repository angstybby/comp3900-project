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
import GroupCard from "@/components/GroupsComponents/GroupCard";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface GroupParams {
  id: number;
  groupName: string;
  description: string;
  members: number;
  MaxMembers: number;
  groupOwnerId: string;
}

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
      fullname: "",
    },
    ProjectInterest: [],
    groups: []
  });
  const [userGroups, setUserGroups] = useState<GroupParams[]>([]);

  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

  const isProjectOwner = projectDetail?.ProjectOwner.zid === profileData.zid;

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/${projectId}`);
      setProjectDetail(response.data);
      const response2 = await axiosInstanceWithAuth.get(`/projects/user-in-group/${profileData.zid}/${projectId}`);
      setUserGroups(response2.data);
      console.log(response2.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [projectId, profileData.zid]);

  useEffect(() => {
    if (profileData.hasOwnProperty('zid')) {
      fetchProjectDetails();
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
      <div className="p-14 h-screen">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-normal">{projectDetail?.title}</h1>
            <p className="mt-4 text-xl font-normal text-gray-500">Project Owner: <span className="font-medium">{projectDetail?.ProjectOwner.fullname} ({projectDetail?.ProjectOwner.zid})</span></p>
          </div>
          {isProjectOwner && (
            <div className="flex flex-row gap-5">
              <ButtonUtility text="Edit Project" onClick={openEditModal} />
              <ButtonPrimary classname="bg-orange-600 hover:bg-orange-800" text="Group Applications" url={`/project/${projectDetail.id}/applications`} />
            </div>
          )}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-normal">Description: <span className="font-bold">{projectDetail?.description}</span></h2>
          <h2 className="text-xl font-normal">Skills: <span className="font-bold">{projectDetail?.skills.map(skill => skill.skillName).join(", ")}</span></h2>
        </div>
        <div className="mt-8 h-48">
          <h1 className="text-2xl font-bold">Your Groups in this Project:</h1>
          <Carousel className="h-full mt-5 w-full max-w-[95%] mx-auto" opts={{
            align: "start"
          }}>
            <CarouselContent >
              {userGroups.map((group) => (
                <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={true} profile={profileData} />
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mt-16">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Skills Gap Analysis</h2>
            <SkillsGapAnalysis projectId={Number(projectId)} />
          </div>
        </div>

      </div >
    </>
  );
};

export default ProjectDetailsOther;
