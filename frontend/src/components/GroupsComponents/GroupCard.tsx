import { UserGroupIcon } from "@heroicons/react/24/outline"

export default function GroupCard() {
    return (
        <div className="h-full bg-gray-200 p-5 py-3 text-center mr-5 rounded-lg hover:bg-gray-300 w-80 hover:cursor-pointer">
            <div className="text-start flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-light">Group Name</h1>
                    <div className="flex flex-row gap-1 items-center">
                        <UserGroupIcon className="h-5 w-5" />
                        <span className="font-light">1/5</span>
                    </div>
                </div>
                <h2 className="text-sm font-light line-clamp-2">Lorem ipsum dolor sit amet</h2>
            </div>


        </div>
    )
}