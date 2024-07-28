import { useNavigate } from "react-router-dom";
import CourseMainSkillBubble from "./CourseMainSkillBubble";
import { useEffect, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { Carousel, CarouselContent } from "../ui/carousel";

interface CourseCardProps {
  id: string;
  courseName: string;
  inCarousel?: boolean;
}

interface Skill {
  skillName: string;
}

export default function CourseCard({ id, courseName, inCarousel }: CourseCardProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/course/${id}`)
  }

  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchMainSkills = async () => {
      try {
        const response = await axiosInstanceWithAuth.get(
          `/course/course-details/${id}`,
        );
        if (response.data.skills.length > 0) {
          setSkills(response.data.skills);
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    }
    fetchMainSkills();
  },[])

  return (
    <div className="select-none h-40 bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-full hover:cursor-pointer transition duration-150 shadow-lg"
      onClick={onClick}
    >
      <div className="text-start flex flex-col gap-1 h-full justify-between">
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-light w-full">{id}</h1>
          <h2 className="text-sm font-light line-clamp-2">{courseName}</h2>
        </div>

        {
          inCarousel 
          ? 
            (
              <CourseMainSkillBubble skill={`Number of skills: ${skills.length}`} key={`${id} skills`} />
            )
          : 
            <Carousel className="w-full max-w-[100%] mx-auto" opts={{
              align: "start"
            }}>
              <CarouselContent className="ml-1">
                {skills.map(skill => (
                  <CourseMainSkillBubble skill={skill.skillName} key={skill.skillName} />
                ))}
              </CarouselContent>
            </Carousel>
          }
      </div>
    </div>
  );

}