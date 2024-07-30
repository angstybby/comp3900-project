import "react-multi-carousel/lib/styles.css";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import GroupCard from "@/components/GroupsComponents/GroupCard";
import { useEffect, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import CreateGroupModal from "@/components/Modals/CreateGroupModal";
import { useProfile } from "@/contexts/ProfileContext";
import LoadingCircle from "@/components/LoadingCircle";

// Group Data Placeholders
interface Group {
  id: number,
  groupName: string,
  description: string,
  members: number,
  MaxMembers: number,
  groupOwnerId: string
}

export default function Groups() {
  const [yourGroups, setYourGroups] = useState<Group[]>([]);
  const [recoGroups, setRecoGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profileData } = useProfile();

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const fetchYourGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.get("/group/groups");
      setYourGroups(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  // recco groups
  const fetchRecoGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.post("/group/get-group-reco");
      setRecoGroups(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchYourGroups();
    fetchRecoGroups();
  }, [])

  return (
    <>
      <CreateGroupModal open={open} close={handleClose} refetchData={fetchYourGroups} />
      <div className="h-screen flex">
        <div className="w-full flex flex-col p-14">
          <div className="h-1/3 flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-4xl font-medium">Your Groups</h1>
              <div>
                <ButtonUtility text="Create Group" classname="h-10" onClick={handleOpen} />
              </div>
            </div>
            {yourGroups.length === 0
              ? (
                <div className="flex justify-center items-center h-full">
                  {(loading ? <LoadingCircle /> :
                    <p className="text-lg text-center">You are not in any groups
                      <br />
                      <span className="text-sm">Create a group or join one</span>
                    </p>
                  )}

                </div>

              ) : (
                <Carousel className="h-full mt-5 w-full max-w-[95%] mx-auto" opts={{
                  align: "start"
                }}>
                  <CarouselContent >
                    {yourGroups.map((group) => (
                      <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={true} profile={profileData} />
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )
            }
          </div>
          <div className="h-2/3">
            <h1 className="text-4xl font-medium mt-6">Groups for you</h1>
            <div className="w-[95%] mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 mt-5 gap-y-14 gap-x-5">
              {recoGroups.map((group) => (
                <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={false} profile={profileData} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}