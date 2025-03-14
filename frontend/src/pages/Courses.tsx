import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/CoursesComponents/CourseCard";
import Cookies from "js-cookie";
import AddCourseModal from "@/components/Modals/AddCourseModal";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import SearchBar from "@/components/Inputs/SearchBar";
import { useEffect, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import LoadingCircle from "@/components/LoadingCircle";
import CourseList from "@/components/CoursesComponents/CourseList";
import UploadModal from "@/components/Modals/UploadModal";

interface Course {
  id: string;
  courseName: string;
}

type UserType = 'admin' | 'student' | 'academic' | null;

export default function Courses() {
  const [loading, setLoading] = useState(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [userType, setUserType] = useState<UserType>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const userTypeFromCookie = Cookies.get('userType') as UserType;
    setUserType(userTypeFromCookie);
  }, []);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.get('/course/user');
      const userCourses = response.data.map((item: any) => item.course)
      setUserCourses(userCourses);
    } catch (error) {
      console.error('Failed to fetch user courses:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  return (
    <div className="h-screen flex justify-center">
      <AddCourseModal
        isVisible={showAddCourseModal}
        close={() => setShowAddCourseModal(false)}
        refetchData={fetchUserCourses}
      />
      <UploadModal
        isVisible={showUploadModal}
        close={() => setShowUploadModal(false)}
        refetchData={fetchUserCourses}
      />
      <div className="w-full flex flex-col p-14">
        <div className="h-2/3">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h1 className="text-4xl font-medium">Courses</h1>
            <div>
              {userType === 'student' && (
                <div className="flex flex-wrap lg:flex-nowrap lg:gap-4 items-center" title="Add Course Button">
                  <div className="w-fit my-2 lg:my-0">
                    <ButtonUtility bg="bg-orange-600 hover:bg-orange-500" text={"Upload Courses Taken"} onClick={() => setShowUploadModal(true)} />
                  </div>
                  <div className="w-fit">
                    <ButtonUtility text={"Add Courses Taken"} onClick={() => setShowAddCourseModal(true)} />
                  </div>
                </div>
              )}
              {/* subject to change, not sure how admin/acadmics are done */}
              {userType === 'admin' && (
                <div className="flex flex-wrap lg:flex-nowrap lg:gap-4 items-center" title="Add Course Button">
                  <div className="w-full my-2 lg:my-0">
                    <ButtonUtility text={"admin Scrape Course"} onClick={() => null} />
                  </div>
                  <div className="w-full">
                    <ButtonUtility text={"admin Add Course"} onClick={() => null} />
                  </div>
                </div>
              )}
            </div>
          </div>
          {userType === 'student' &&
            <div className="mt-8">
              <h2 className="text-2xl font-medium mb-4">Your Courses</h2>
              {loading &&
                <div className="flex justify-center my-5">
                  <LoadingCircle />
                </div>
              }
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
                {userCourses.map((course) => (
                  <CourseCard key={course.id} id={course.id} courseName={course.courseName} />
                ))}
              </div>
            </div>
          }
          <div className="w-[95%] my-5">
            <SearchBar onSearchTermChange={setSearchTerm} />
          </div>
          <h2 className="text-2xl font-medium mb-4">All courses</h2>
          <CourseList searchTerm={searchTerm} />
        </div>
      </div>
    </div >
  )
}
