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

// Group Data Placeholders
const groups = [
  {
    id: 1,
    name: "Group Name 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
    members: 1,
    maxMembers: 5
  },
  {
    id: 2,
    name: "Group Name 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
    members: 2,
    maxMembers: 5
  },
  {
    id: 3,
    name: "Group Name 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
    members: 3,
    maxMembers: 5
  },
  {
    id: 4,
    name: "Group Name 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
    members: 4,
    maxMembers: 5
  },
  {
    id: 5,
    name: "Group Name 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
    members: 5,
    maxMembers: 5
  },
]

interface Group {
  id: number,
  name: string,
  description: string,
  members: number,
  maxMembers: number
}

export default function Groups() {
  const [yourGroups, setYourGroups] = useState<Group[]>([]) 

  useEffect(() => {
    const fetchYourGroups = async () => {
      const response = await axiosInstanceWithAuth.get("/group/groups");
      console.log(response.data);
      setYourGroups(response.data);
    }

    fetchYourGroups();
  }, [])

  return (
    <div className="h-screen flex">
      <div className="w-full flex flex-col p-14">
        <div className="h-1/3 flex flex-col">
          <h1 className="text-4xl font-medium">Your Groups</h1>
          <Carousel className="mt-5 w-full max-w-[95%] mx-auto" opts={{
            align: "start"
          }}>
            <CarouselContent>
              {yourGroups.map((group) => (
                <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={true} />
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="h-2/3">
          <h1 className="text-4xl font-medium">Groups for you</h1>
          <div className="w-[95%] mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 mt-5 gap-y-14 gap-x-5">
            {groups.map((group) => (
              <GroupCard key={group.id} groupId={group.id} group={group} inCarousel={false} />
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}