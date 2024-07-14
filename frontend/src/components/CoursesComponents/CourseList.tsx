import { useEffect, useRef, useState } from 'react'
import CourseCard from './CourseCard';
import { axiosInstanceWithAuth } from '@/api/Axios';

interface Course {
  id: string;
  courseName: string;
} 


const CourseList = ({ searchTerm } : { searchTerm: string}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const indexRef = useRef(25);
  const paginateNoSearch = 25;
  const paginateWithSearch = 10;

  const fetchCourses = async () => {
    try {
      let response = { data : []};
      if (!searchTerm) {
        response = await axiosInstanceWithAuth.get('/course/all');
      } else {
        response = await axiosInstanceWithAuth.post(`/course/search`, {
          name: searchTerm.trim()
        });
      }
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const loadMore = async (startIndex: number) => {
    try {
      let response = { data : []};
      if (!searchTerm) {
        response = await axiosInstanceWithAuth.get(`/course/all?offset=${startIndex}`);
      } else {
        response = await axiosInstanceWithAuth.post(`/course/search?offset=${startIndex}`, {
          name: searchTerm.trim(),
        });
      }
      setCourses((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch more courses:', error);
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
  };

  useEffect(() => {
    if (!searchTerm) {
      indexRef.current = 25;
    } else {
      indexRef.current = 10;
    }
    fetchCourses();
    window.addEventListener("scroll", loadOnScroll);
    return () => window.removeEventListener("scroll", loadOnScroll);
  }, [searchTerm]);

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
        {courses.map((course) => (
          <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
        ))}
      </div>
    </>
  )
}

export default CourseList