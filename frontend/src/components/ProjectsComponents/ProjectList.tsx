import { axiosInstanceWithAuth } from "@/api/Axios";
import { Project } from "@/utils/interfaces";
import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ searchTerm }: { searchTerm: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const indexRef = useRef(25);
    const paginateNoSearch = 25;
    const paginateWithSearch = 10;

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
            response.data.forEach((project: any) => {
                project.id = parseInt(project.id);
            });
            console.log(response.data);
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const loadMore = async (startIndex: number) => {
        try {
            let response = { data: [] };
            if (!searchTerm) {
                response = await axiosInstanceWithAuth.get(`/projects/all?offset=${startIndex}`);
            } else {
                response = await axiosInstanceWithAuth.post(`/projects/search?offset=${startIndex}`, {
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
        if (!searchTerm) {
            indexRef.current = 25;
        } else {
            indexRef.current = 10;
        }
        fetchProjects();
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
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}