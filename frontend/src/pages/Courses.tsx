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