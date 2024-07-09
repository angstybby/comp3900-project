import { UserGroupIcon } from "@heroicons/react/24/outline"
import { CarouselItem } from "@/components/ui/carousel";

interface GroupCardProps {
    group: {
        name: string,
        description: string,
        members: number,
        maxMembers: number
    }
    inCarousel: boolean
}

export default function GroupCard({ group, inCarousel }: GroupCardProps) {
    const content = (
        <div className="h-32 bg-gray-200 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-80 hover:cursor-pointer">
            <div className="text-start flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-light">{group.name}</h1>
                    <div className="flex flex-row gap-1 items-center">
                        <UserGroupIcon className="h-5 w-5" />
                        <span className="font-light">{group.members}/{group.maxMembers}</span>
                    </div>
                </div>
                <h2 className="text-sm font-light line-clamp-2">{group.description}</h2>
            </div>
        </div>
    );

    return inCarousel ? (
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            {content}
        </CarouselItem>
    ) : (
        content
    );
}
