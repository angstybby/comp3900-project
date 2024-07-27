import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import { Link } from "react-router-dom";
import LoadingCircle from "../LoadingCircle";
import Cookies from "js-cookie";

type UserType = 'admin' | 'student' | 'academic' | null;

export default function ProjectList({ searchTerm }: { searchTerm: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
    const [projectLoading, setProjectLoading] = useState(false);
    const indexRef = useRef(25);
    const paginateNoSearch = 25;
    const paginateWithSearch = 10;
    const [userType, setUserType] = useState<UserType>(null);

    const fetchProjects = async () => {
        try {
            let response = { data: [] };
            if (!searchTerm) {
                response = await axiosInstanceWithAuth.get('/projects/all?skip=0');
            } else {
                response = await axiosInstanceWithAuth.post(`/projects/search`, {
                    name: searchTerm.trim()
                });
            }
            console.log(response.data);
            response.data.forEach((project: any) => {
                project.id = parseInt(project.id);
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const fetchRecommendedProjects = async () => {
        try {
            setProjectLoading(true);
            const response = await axiosInstanceWithAuth.post('/projects/get-career-reco'); // Replace with real skills data
            console.log("Recommended Projects:",response.data);
            response.data.forEach((project: any) => {
                project.id = parseInt(project.id);
            });
            setRecommendedProjects(response.data);
            setProjectLoading(false);
        } catch (error) {
            console.error('Failed to fetch recommended projects:', error);
        }
    };

    const loadMore = async (startIndex: number) => {
        try {
            let response = { data: [] };
            if (!searchTerm) {
                response = await axiosInstanceWithAuth.get(`/projects/all?skip=${startIndex}`);
            } else {
                response = await axiosInstanceWithAuth.post(`/projects/search?skip=${startIndex}`, {
                    name: searchTerm.trim(),
                });
            }
            setProjects((prev) => [...prev, ...response.data]);
        } catch (error) {
            console.error('Failed to fetch more projects:', error);
        }
        if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
            return;
        }
    }

    const loadOnScroll = () => {
        const scrollY = window.scrollY;
        const targetScroll = document.body.scrollHeight - window.innerHeight;
        const leeway = 5; // Allow for a leeway of ±5 pixels

        if (Math.abs(scrollY - targetScroll) <= leeway) {
            loadMore(indexRef.current);
            if (!searchTerm) {
                indexRef.current += paginateNoSearch;
            } else {
                indexRef.current += paginateWithSearch;
            }
        }
    }

    useEffect(() => {
        const userTypeFromCookie = Cookies.get('userType') as UserType;
        setUserType(userTypeFromCookie);
        if (!searchTerm) {
            indexRef.current = 25;
        } else {
            indexRef.current = 10;
        }
        fetchProjects();
        fetchRecommendedProjects();
        window.addEventListener('scroll', loadOnScroll);
        return () => window.removeEventListener('scroll', loadOnScroll);
    }, [searchTerm]);

    return (
        <div className="w-full mx-auto">
            {projects.length === 0 ? (
                <div className="flex justify-center my-5 w-full">
                    <p className="text-2xl font-bold">No projects found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-12 ">
                    {projects.map((project) => (
                        <Link key={project.id} to={`/project/${project.id}`}>
                            <ProjectCard key={project.id} project={project} />
                        </Link>
                    ))}
                </div>
            )}

            {userType === 'student' && (
              projectLoading ? (
                <div className="w-full text-center">
                  <LoadingCircle />
                </div>
              ) : (
                <div className="mt-10">
                  <h2 className="text-3xl font-semibold mb-5">Recommended Projects</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-12 ">
                    {recommendedProjects.map((project) => (
                      <Link key={project.id} to={`/project/${project.id}`}>
                        <ProjectCard key={project.id} project={project} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
        </div>
    );
}
