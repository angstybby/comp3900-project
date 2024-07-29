import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    ChevronDownIcon,
    PencilIcon,
    ViewColumnsIcon,
    UserGroupIcon
} from '@heroicons/react/16/solid'

export default function GroupOwnerOptions({ openEditModal, openInviteUserModal, openMembersDetailsModal }: { openEditModal: () => void, openInviteUserModal: () => void, openMembersDetailsModal: () => void }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-700 data-[open]:bg-indigo-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    Options
                    <ChevronDownIcon className="size-4 fill-white/60" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52" align="end">
                    <DropdownMenuItem>
                        <button onClick={openMembersDetailsModal} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
                            <ViewColumnsIcon className="size-4 fill-black/30" />
                            View Members
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">⌘A</kbd>
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={openEditModal} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
                            <PencilIcon className="size-4 fill-black/30" />
                            Edit Details
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={openInviteUserModal} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
                            <UserGroupIcon className="size-4 fill-black/30" />
                            Invite Users
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">⌘D</kbd>
                        </button>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
