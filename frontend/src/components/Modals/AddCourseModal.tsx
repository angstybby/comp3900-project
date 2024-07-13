import { ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import ButtonSubmitWithClick from "@/components/Buttons/ButtonSubmitWClick";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { axiosInstanceWithAuth } from "@/api/Axios";
import SearchCourse from "../Inputs/SearchCourse";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import ButtonWarning from "../Buttons/ButtonWarning";

interface AddCourseModalProps {
  isVisible: boolean;
  close: () => void;
  refetchData: () => void;
}

interface Course {
  id: string;
  courseName: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isVisible, close, refetchData }) => {
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
      close();
      refetchData();
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error adding courses", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isVisible}
        as="div"
        className="relative z-[100] focus:outline-none transition duration-150 ease-out"
        transition
        onClose={() => {
          close();
          setSelectedCourses([]);
        }}
      >
        <DialogBackdrop
          className="fixed inset-0 bg-black/30 data-[closed]:opacity-0 duration-150 ease-out"
          transition
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex flex-wrap min-h-full items-center justify-center p-6">
            <DialogPanel
              transition
              className="w-full max-w-2xl rounded-xl bg-white/60 p-6 px-8 backdrop-blur-2xl duration-150 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle className='mb-5'>
                <p className='font-bold text-2xl'>Add Courses</p>
              </DialogTitle>
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
                    <div key={course.id} className="flex justify-between items-center p-2 border-b border-black">
                      <span>{course.courseName} ({course.id})</span>
                      <div onClick={() => handleRemoveCourse(course.id)}>
                        <ButtonWarning text={"Remove"}/>
                      </div>
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
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddCourseModal;
