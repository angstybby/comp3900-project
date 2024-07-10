import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/CoursesComponents/CourseCard";
import { useNavigate } from 'react-router-dom';

// stubs
const courses = [
  {
    id: 1,
    name: "Course Name 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 2,
    name: "Course Name 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 3,
    name: "Course Name 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 4,
    name: "Course Name 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
  {
    id: 5,
    name: "Course Name 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam deserunt et officiis, explicabo voluptatem ex repellendus consequatur dolore dicta dignissimos, voluptatum ullam saepe, error quibusdam exercitationem commodi molestias qui nesciunt?",
  },
]


export default function Courses() {
    const navigate = useNavigate();
    return (
      <div className="h-screen flex justify-center">
        <div className="w-full flex flex-col p-14">
          <div className="h-2/3">
            <h1 className="text-4xl font-medium pb-8">Courses</h1>
            <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onClick={() => navigate(`/course/${course.id}`)} />
              ))}
            </div>
          </div>
        </div>
      </div >
    )
}
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AddCourseModal from "@/components/Modals/AddCourseModal";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import { useNavigate } from "react-router-dom";

type UserType = 'admin' | 'student' | 'academic' | null;

const Courses: React.FC = () => {
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userTypeFromCookie = Cookies.get('userType') as UserType;
    setUserType(userTypeFromCookie);
  }, []);

  return (
    <div className="w-full flex flex-col p-14">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-medium">Courses</h1>
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
    </div>
  );
};

export default Courses;
