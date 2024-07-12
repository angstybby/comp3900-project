import React, { useEffect, useRef, useState } from 'react'
import CourseCard from './CourseCard';
import { axiosInstanceWithAuth } from '@/api/Axios';

interface Course {
  id: string;
  courseName: string;
} 

interface CourseListProps {
  searchTerm?: string;
}

const CourseList: React.FC<CourseListProps> = ( searchTerm ) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const indexRef = useRef(25);
  const paginate = 25;

  const loadMore = async (startIndex: number) => {
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
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
      setLoading(false);
    };

    const loadOnScroll = () => {
      const scrollY = window.scrollY;
      const targetScroll = document.body.scrollHeight - window.innerHeight;
      const leeway = 5; // Allow for a leeway of ±5 pixels
    
      if (Math.abs(scrollY - targetScroll) <= leeway) {
        loadMore(indexRef.current);
        indexRef.current += paginate;
      }
    };

    fetchCourses();
    window.addEventListener("scroll", loadOnScroll);
    return () => window.removeEventListener("scroll", loadOnScroll);
  
  }, []);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
      {courses.map((course) => (
        <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
      ))}
    </div>
  )
}

export default CourseList