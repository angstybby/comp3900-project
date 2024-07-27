import Bubble from "./ProjectStatusBubble";

interface ProjectCardStudent {
    project: {
        projectId: number;
        title: string;
        description: string;
        status: string;
    };
}

export default function ProjectCard({ project }: ProjectCardStudent) {
    return (
        <div className="h-40 bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-full hover:cursor-pointer transition duration-150 shadow-lg"
        >
            <div className="flex flex-col justify-between h-full">
                <div className="text-start flex flex-col gap-1">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-2xl font-light">{project.title}</h1>
                    </div>
                    <h2 className="text-sm font-light line-clamp-2">{project.description}</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row flex-wrap">
                        <Bubble text={project.status} />
                    </div>
                </div>
            </div>
        </div>
    );

}