import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import ButtonSubmitWithClick from "@/components/Buttons/ButtonSubmitWClick";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { axiosInstanceWithAuth } from "@/api/Axios";

interface AddCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Course {
  id: string;
  courseName: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const response = await axiosInstanceWithAuth.post("/course/search", { name: searchTerm });
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching course suggestions", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Input changing");
    setSearchTerm(e.target.value);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourses((prev) => [...prev, course]);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleAddCourse = async () => {
    try {
      setLoading(true);
      for (const course of selectedCourses) {
        await axiosInstanceWithAuth.post(
          "/course/add",
          { id: course.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
      setLoading(false);
      onClose();
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error adding courses", error);
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="add-course-modal"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Course
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="search"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                Search Courses
              </label>
              <input
                type="text"
                id="search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-lg shadow-md mt-2 max-h-48 overflow-y-auto">
                  {suggestions.map((course) => (
                    <li
                      key={course.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectCourse(course)}
                    >
                      {course.courseName} ({course.id})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-medium">Selected Courses</h4>
              {selectedCourses.map((course) => (
                <div key={course.id} className="p-2 border-b">
                  <span>{course.courseName} ({course.id})</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              {loading ? (
                <ButtonLoading />
              ) : (
                <ButtonSubmitWithClick text={"Add Courses"} onClick={handleAddCourse} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
