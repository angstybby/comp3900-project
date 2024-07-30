import { useEffect, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import GroupCard from "@/components/GroupsComponents/GroupCard";
import LoadingCircle from "@/components/LoadingCircle";
import { useProfile } from "@/contexts/ProfileContext";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Group {
  id: number;
  groupName: string;
  description: string;
  members: number;
  MaxMembers: number;
  groupOwnerId: string;
}

export default function CourseReco() {
  const [recoGroups, setRecoGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { profileData } = useProfile();

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
    fetchRecoGroups();
  }, []);

  return (
    <>
      <div className="flex min-h-screen justify-center py-10">
        <div className="w-full max-w-xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">
            Skill <br /> Issue
          </h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Here are some recommendations or you can create your own group
          </h2>

          <div className="mt-8">
            <form className="max-w-l mx-auto space-y-4" action="#" method="POST">
              <div>
                <label htmlFor="coursesDone" className="block text-lg font-medium leading-6 text-gray-900">
                  Group Recommendations
                </label>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoadingCircle />
                  </div>
                ) : recoGroups.length === 0 ? (
                  <p className="text-lg text-center">
                    No group recommendations available at the moment.
                  </p>
                ) : (
                  <Carousel className="h-full mt-5 w-full max-w-[95%] mx-auto" opts={{ align: "start" }}>
                    <CarouselContent>
                      {recoGroups.map((group) => (
                        <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={true} profile={profileData} />
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>
              <div>
                <label htmlFor="OrLabel" className="block text-lg text-center font-medium leading-6 text-gray-900">
                  <b>OR</b>
                </label>
              </div>
              <div className="mt-4">
                <ButtonPrimary text="Create Group" url="/groups" />
              </div>
            </form>
          </div>
          <div className="mt-20 flex justify-end">
            <div className="w-1/6">
              <ButtonPrimary text="Next" url="/Dashboard" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
