import { axiosInstanceWithAuth } from "@/api/Axios";
import ProjectCard from "@/components/ProjectsComponents/ProjectCard";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { useProfile } from "@/contexts/ProfileContext";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditGroupModal from "@/components/Modals/EditGroupModal";
import InviteUserModal from "@/components/Modals/InviteUserModal";
import GroupOwnerOptions from "@/components/GroupsComponents/GroupOwnerOptions";
import { set } from "zod";

interface Details {
  id: number,
  groupName: string,
  description: string,
  groupOwnerId: string,
  members: number,
  MaxMembers: number
  groupOwnerName: string
  CombinedSkills: string[]
}


const stubProject = {
  id: 1,
  name: "Stub Project",
  description: "This is a stub project",
}


const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { profileData } = useProfile();

  const [details, setDetails] = useState<Details>({
    id: 0,
    groupName: "",
    description: "",
    groupOwnerId: "",
    members: 0,
    MaxMembers: 0,
    groupOwnerName: "",
    CombinedSkills: []
  });
  const [recc, setRecc] = useState<string[]>(["1", "2", "3", "4", "5"]);
  const [editModal, setEditModal] = useState(false);
  const [inviteUserModal, setInviteUserModal] = useState(false);
  const [userInGroup, setUserInGroup] = useState(false);

  const isOwner = details.groupOwnerId === profileData.zid;
  const handleClickProject = () => {
    // navigate(`/project/${project.id}`);
  }

  const fetchDetails = async () => {
    const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`, {
      data: {
        groupId: groupId,
      }
    })

    const skills = response.data.CombinedSkills.map((skill: {
      skillName: string
    }) => {
      return skill.skillName;
    })


    response.data.CombinedSkills = skills;
    console.log(response.data);
    setDetails(response.data);
  }

  const leaveGroup = async () => {
    const response = await axiosInstanceWithAuth.post("/group/leave", {
      groupId: groupId,
    })
    console.log(response.data);
    navigate("/groups");
  }

  const expressInterest = async () => {
    const response = await axiosInstanceWithAuth.post("/group/express-interest", {
      groupId: groupId,
    })
    console.log(response.data);
  }

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`, {
        data: {
          groupId: groupId,
        }
      })

      const skills = response.data.CombinedSkills.map((skill: {
        skillName: string
      }) => {
        return skill.skillName;
      })



      response.data.CombinedSkills = skills;
      console.log(response.data);
      setDetails(response.data);
    }

    const checkUserInGroup = async () => {
      const response = await axiosInstanceWithAuth.get(`/group/user-in-group/${groupId}`);
      console.log(response.data);
      setUserInGroup(response.data);
    }

    // const getReccs = async () => {
    //   const response = await axiosInstanceWithAuth.post("/group/get-reccs", {
    //     prompt: getStubSkills(),
    //   })
    //   console.log(response.data);
    // }

    fetchDetails();
    checkUserInGroup();
    // getReccs();
  }, [groupId])

  const navigate = useNavigate();
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
                  {userInGroup ? (<ButtonUtility classname="p-10 text-lg bg-red-700 hover:bg-red-800" text="Leave Group" onClick={leaveGroup} />) : (<ButtonUtility classname="p-10 text-lg bg-green-700 hover:bg-green-800" text="Apply to Join" onClick={leaveGroup} />)}
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
      </div>
    </>
  )
}

export default GroupDetails