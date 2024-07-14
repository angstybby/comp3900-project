export default function Bubble({ isOwner }: { isOwner: boolean }) {
    return (
        <div className={`rounded-full ${isOwner ? "bg-pink-300" : "bg-teal-300"} w-fit px-3 py-0.5`}>
            <p className="text-sm font-light">{isOwner ? "Group Owner" : "Group Member"}</p>
        </div>
    )
}