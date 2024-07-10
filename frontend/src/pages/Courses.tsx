import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/CoursesComponents/CourseCard";
import SearchBar from "@/components/Inputs/SearchBar";
import { useEffect, useRef, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import LoadingCircle from "@/components/LoadingCircle";

interface Course {
  id: string;
  courseName: string;
} 

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  const indexRef = useRef(25);
  const paginate = 25;

  const loadMore = async (startIndex: number) => {
    console.log(startIndex)
    try {
      const response = await axiosInstanceWithAuth.get(`/course/all?offset=${startIndex}`);
      setCourses((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch more courses:', error);
    }
    if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
      return;
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstanceWithAuth.get('/course/all');
        setCourses(response.data);
        console.log("Success")
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
      setLoading(false);
    };

    const loadOnScroll = () => {
      if (window.scrollY === document.body.scrollHeight - window.innerHeight) {
        loadMore(indexRef.current);
        indexRef.current += paginate;
      }
    };

    fetchCourses();
    window.addEventListener("scroll", loadOnScroll);
    return () => window.removeEventListener("scroll", loadOnScroll);
  
  }, []);
  
  return (
    <div className="h-screen flex justify-center">
      <div className="w-full flex flex-col p-14">
        <div className="h-2/3">
          <h1 className="text-4xl font-medium pb-8">Courses</h1>
          <div className="w-[95%]">
            <SearchBar/>
          </div>
          {loading && 
            <div className="flex justify-center">
              <LoadingCircle/>
            </div>
          }
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
            {courses.map((course) => (
              <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}