import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/CoursesComponents/CourseCard";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import AddCourseModal from "@/components/Modals/AddCourseModal";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import SearchBar from "@/components/Inputs/SearchBar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import LoadingCircle from "@/components/LoadingCircle";

interface Course {
  id: string;
  courseName: string;
} 

type UserType = 'admin' | 'student' | 'academic' | null;

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  const indexRef = useRef(25);
  const paginate = 25;

  const loadMore = async (startIndex: number) => {
    console.log(startIndex)
    console.log("LoadMore!")
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
    const userTypeFromCookie = Cookies.get('userType') as UserType;
    setUserType(userTypeFromCookie);
  }, []);

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
      const scrollY = window.scrollY;
      const targetScroll = document.body.scrollHeight - window.innerHeight;
      const leeway = 5; // Allow for a leeway of ±5 pixels
    
      if (Math.abs(scrollY - targetScroll) <= leeway) {
        console.log("INSIDE LOAD ON SCROLL Loadmore")
        loadMore(indexRef.current);
        indexRef.current += paginate;
      }
    };

    fetchCourses();
    window.addEventListener("scroll", loadOnScroll);
    return () => window.removeEventListener("scroll", loadOnScroll);
  
  }, []);


  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await axiosInstanceWithAuth.get('/course/user');
        console.log("User courses fetched successfully");
        const userCourses = response.data.map((item: any) => item.course)
        console.log(userCourses);
        setUserCourses(userCourses);
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      }
    };

    fetchUserCourses();
  }, []);

  
  // TODO: If courses are added then dont show it
  return (
    <div className="h-screen flex justify-center">

      <div className="w-full flex flex-col p-14">
        <div className="h-2/3">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-medium pb-8">Courses</h1>

            {userType === 'student' && (
              <div className="flex items-center space-x-4" title="Add Course Button">
                <ButtonUtility text={"Upload Courses Taken"} onClick={() => navigate('/Upload')} />
                <ButtonUtility text={"Add Courses Taken"} onClick={() => setShowAddCourseModal(true)} />
              </div>
            )}
            {/* subject to change, not sure how admin/acadmics are done */}
            {userType === 'admin' && (
              <div className="flex items-center space-x-4" title="Add Course Button">
                <ButtonUtility text={"admin Scrape Course"} onClick={() => null} />
                <ButtonUtility text={"admin Add Course"} onClick={() => null} />
              </div>
            )}
          </div>
          <AddCourseModal
            isVisible={showAddCourseModal}
            onClose={() => setShowAddCourseModal(false)}
          />

          {/* temporary value and onChange */}
          <div className="w-[95%]">
            <SearchBar/>
          </div>

          {loading && 
            <div className="flex justify-center">
              <LoadingCircle/>
            </div>
          }
          <div className="mt-8">
            <h2 className="text-2xl font-medium mb-4">Your Courses</h2>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
              {userCourses.map((course) => (
                <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-medium mb-4">All courses</h2>
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
