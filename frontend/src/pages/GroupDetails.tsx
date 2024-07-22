import { axiosInstanceWithAuth } from "@/api/Axios";

import { useCallback, useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom"

import { useProfile } from "@/contexts/ProfileContext";

import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditGroupModal from "@/components/Modals/EditGroupModal";
import InviteUserModal from "@/components/Modals/InviteUserModal";
import GroupOwnerOptions from "@/components/GroupsComponents/GroupOwnerOptions";
import ProjectCard from "@/components/ProjectsComponents/ProjectCard";

import { UserGroupIcon } from "@heroicons/react/24/outline";

import { Project, Details } from "@/utils/interfaces";
import LoadingCircle from "@/components/LoadingCircle";

const GroupDetails = () => {
  const [details, setDetails] = useState<Details>({
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
  const [recc, setRecc] = useState<Project[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [inviteUserModal, setInviteUserModal] = useState(false);
  const [userInGroup, setUserInGroup] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const { groupId } = useParams<{ groupId: string }>();
  const { profileData } = useProfile();
  const navigate = useNavigate();

  const isOwner = details.groupOwnerId === profileData.zid;

  const fetchDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`);
      const skills = response.data.CombinedSkills.map((skill: { skillName: string }) => skill.skillName);
      response.data.CombinedSkills = skills;
      setDetails(response.data);

      // Get recommendations
      setProjectLoading(true);
      const response2 = await axiosInstanceWithAuth.post('/group/get-reccs', { prompt: skills.join(',') });
      setRecc(response2.data);
      setProjectLoading(false);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  }, [groupId]);

  const checkUserInGroup = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/group/user-in-group/${groupId}`);
      setUserInGroup(response.data);
    } catch (error) {
      console.error("Error checking user in group:", error);
    }
  }, [groupId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    checkUserInGroup();
  }, [checkUserInGroup]);

  const leaveGroup = async () => {
    try {
      await axiosInstanceWithAuth.post("/group/leave", { groupId });
      navigate("/groups");
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const expressInterest = async () => {
    try {
      await axiosInstanceWithAuth.post("/group/express-interest", { groupId });
    } catch (error) {
      console.error("Error expressing interest:", error);
    }
  };

  return (
    <>
      <EditGroupModal open={editModal} close={() => setEditModal(false)} refetchData={fetchDetails} initValues={details} />
      <InviteUserModal open={inviteUserModal} close={() => setInviteUserModal(false)} refetchData={fetchDetails} groupId={details.id} />
      <div className="p-14">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-7">
            <p className="text-4xl font-bold">{details.groupName}</p>
            <div className="text-4xl font-semibold flex flex-row gap-2 items-center">
              <UserGroupIcon className="w-10 h-10" />
              <span className="font-normal">{`${details.members}/${details.MaxMembers}`}</span>
            </div>
          </div>
          <div>
            <div className="flex flex-row gap-5">
              {isOwner ? (
                <>
                  <GroupOwnerOptions openEditModal={() => setEditModal(true)} openInviteUserModal={() => setInviteUserModal(true)} />
                </>
              ) : (
                <>
                  {userInGroup ?
                    (<ButtonUtility classname="p-10 text-lg bg-red-700 hover:bg-red-800" text="Leave Group" onClick={leaveGroup} />)
                    :
                    (<ButtonUtility classname="p-10 text-lg bg-green-700 hover:bg-green-800" text="Apply to Join" onClick={expressInterest} />)}
                </>
              )}


            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className="font-light text-2xl mt-5 text-gray-500">Group Owner: <span className="font-normal">{details.groupOwnerName} ({details.groupOwnerId})</span></p>
          <div className="flex flex-col gap-1 mt-5">
            <p className="font-bold text-lg ">Group Description: <span className="text-black font-normal">{`${details.description}`}</span></p>
            <p className="font-bold text-lg">Group Skills: <span className="text-black font-normal">{details.CombinedSkills.join(", ")}</span></p>
          </div>
        </div>

        <p className="mt-10 text-2xl font-bold mb-5">{`Recommended Projects`}</p>

        <div>
          {projectLoading ? (
            <div className="w-full text-center">
              <LoadingCircle />
            </div>
          ) :
            (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recc.map((project) => (
                  <Link key={project.id} to={`/group/${groupId}/project/${project.id}`}>
                    <ProjectCard project={project} />
                  </Link>
                ))}
              </div>
            )
          }

        </div>
      </div >
    </>
  )
}

export default GroupDetails