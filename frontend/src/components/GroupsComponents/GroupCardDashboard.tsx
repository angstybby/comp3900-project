import { UserGroupIcon } from "@heroicons/react/24/outline"
import { CarouselItem } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import Bubble from "./Bubble";

interface GroupCardProps {
    groupId: number,
    group: {
        groupName: string,
        description: string,
        members: number,
        MaxMembers: number
        groupOwnerId: string
    }
    inCarousel: boolean
    profile: {
        zid: string;
        profilePicture: string;
        fullname: string;
        description: string;
        resume: string;
    }
}

export default function GroupCardDashboard({ groupId, group, inCarousel, profile }: GroupCardProps) {
    console.log(groupId, group, inCarousel);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/group/${groupId}`);
    }
    const isOwner = group.groupOwnerId === profile.zid

    const content = (
        <div onClick={handleClick} className="h-40 bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-full hover:cursor-pointer transition duration-150 shadow-lg">
            <div className="flex flex-col justify-between h-full">
                <div className="text-start flex flex-col gap-1">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-2xl font-light">{group.groupName}</h1>
                        <div className="flex flex-row gap-1 items-center">
                            <UserGroupIcon className="h-5 w-5" />
                            <span className="font-light">{group.members}/{group.MaxMembers}</span>
                        </div>
                    </div>
                    <h2 className="text-sm font-light line-clamp-2">{group.description}</h2>
                </div>
                {inCarousel && <div className="text-start">
                    <Bubble isOwner={isOwner} />
                </div>}
            </div>
        </div>
    );

    return inCarousel ? (
        <CarouselItem className="lg:basis-1/2 md:basis-1/3">
            {content}
        </CarouselItem>
    ) : (
        content
    );
}
