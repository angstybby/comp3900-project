import "react-multi-carousel/lib/styles.css";
import Cookies from "js-cookie";
import { UserType } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import CreateProjectModal from "@/components/Modals/CreateProjectModal";
import ProjectList from "@/components/ProjectsComponents/ProjectList";
// import { set } from "zod";
// import { axiosInstanceWithAuth } from "@/api/Axios";
import SearchBar from "@/components/Inputs/SearchBar";


// stubs
// const projects = [
//   {
//     id: 1,
//     title: "Project Name 1",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
//   },
//   {
//     id: 2,
//     title: "Project Name 2",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
//   },
//   {
//     id: 3,
//     title: "Project Name 3",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
//   },
//   {
//     id: 4,
//     title: "Project Name 4",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
//   },
//   {
//     id: 5,
//     title: "Project Name 5",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
//   },
// ]

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
}


export default function Project() {
  const [userType, setUserType] = useState<UserType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  useEffect(() => {
    const userTypeFromCookie = Cookies.get('userType') as UserType;
    setUserType(userTypeFromCookie);
  }, []);

  const refreshPage = () => {
    window.location.reload();
  }



  return (
    <>
      <CreateProjectModal open={createProjectModalOpen} close={() => setCreateProjectModalOpen(false)} refetchData={() => refreshPage()} />
      <div className="h-screen flex justify-center">
        <div className="w-[95%] flex flex-col p-14">
          <div className="w-full mx-auto flex flex-row justify-between">
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
          <div className="w-full mx-auto my-5">
            <SearchBar onSearchTermChange={setSearchTerm} placeholder="Search for a project..." />
          </div>
          <ProjectList searchTerm={searchTerm} />
        </div>
      </div>
    </>
  )
}