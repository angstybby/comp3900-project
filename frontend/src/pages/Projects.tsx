import "react-multi-carousel/lib/styles.css";
import ProjectCard from "@/components/ProjectsComponents/ProjectCard";
import Cookies from "js-cookie";
import { UserType } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import CreateProjectModal from "@/components/Modals/CreateProjectModal";
import { set } from "zod";

// stubs
const projects = [
  {
    id: 1,
    title: "Project Name 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 2,
    title: "Project Name 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 3,
    title: "Project Name 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 4,
    title: "Project Name 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 5,
    title: "Project Name 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
]


export default function Project() {
  const [userType, setUserType] = useState<UserType>(null);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  const refetchData = () => {
    console.log('Refetching data');
  }

  useEffect(() => {
    const userTypeFromCookie = Cookies.get('userType') as UserType;
    setUserType(userTypeFromCookie);
  }, []);

  return (
    <>
      <CreateProjectModal open={createProjectModalOpen} close={() => setCreateProjectModalOpen(false)} refetchData={() => refetchData()} />
      <div className="h-screen flex justify-center">
        <div className="w-full flex flex-col p-14">
          <div className="flex flex-row justify-between">
            <h1 className="text-4xl font-medium pb-8">
              {userType === 'student' ? 'Your Projects' : 'Manage Projects'}
            </h1>
            {userType !== 'student' && (
              <div>
                <ButtonUtility text="Add Project" onClick={() => {
                  setCreateProjectModalOpen(true);
                }} classname="p-10" />
              </div>
            )}
          </div>
          <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}