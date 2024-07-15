import { useNavigate } from "react-router-dom"
interface ProjectCardProps {
    project: {
        id: number;
        name: string,
        description: string,
    }
    onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
      <div className="h-32 bg-gray-200 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-80 hover:cursor-pointer"
        onClick={onClick}
      >
          <div className="text-start flex flex-col gap-1">
              <div className="flex flex-row justify-between items-center">
                  <h1 className="text-2xl font-light">{project.name}</h1>
              </div>
              <h2 className="text-sm font-light line-clamp-2">{project.description}</h2>
          </div>
      </div>
  );

}