import { ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import ButtonSubmitWithClick from "@/components/Buttons/ButtonSubmitWClick";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonExit from "../Buttons/ButtonExit";
import SearchBar from "@/components/Inputs/SearchBar";
import SearchCourse from "../Inputs/SearchCourse";

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
          const response = await axiosInstanceWithAuth.post("/course/searchExc", { name: searchTerm });
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

  // Set Search Change Field
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  // Check if course is in selected
  const handleSelectCourse = (course: Course) => {
    if (!selectedCourses.some((c) => c.id === course.id)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
    setSearchTerm("");
    setSuggestions([]);
  };

  // filters / removes out the selected courseID
  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((course) => course.id !== courseId));
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
          <ButtonExit onClick={onClose}/>
        </div>
        <div className="p-4 md:p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="search"
                className="block text-lg mb-2 font-medium text-gray-900 dark:text-white"
              >
                Search Courses
              </label>
              <SearchCourse value={searchTerm} onChange={handleSearchChange} />
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
                <div key={course.id} className="flex justify-between items-center p-2 border-b">
                  <span>{course.courseName} ({course.id})</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveCourse(course.id)}
                  >
                    Remove
                  </button>
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
