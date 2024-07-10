import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/CoursesComponents/CourseCard";
import SearchBar from "@/components/Inputs/SearchBar";
import { useEffect, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";

interface Course {
  id: string;
  courseName: string;
  skills: string[];
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstanceWithAuth.get('/course/all');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
  
    fetchCourses();
  }, []);
  
  return (
    <div className="h-screen flex justify-center">
      <div className="w-full flex flex-col p-14">
        <div className="h-2/3">
          <h1 className="text-4xl font-medium pb-8">Courses</h1>
          <div className="w-[95%]">
            <SearchBar/>
          </div>
          <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}