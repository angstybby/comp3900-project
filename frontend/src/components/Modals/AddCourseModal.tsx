// AddCourseModal.tsx
import { FormEvent, ChangeEvent, useState } from "react";
import "flowbite/dist/flowbite.min.css";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { axiosInstanceWithAuth } from "@/api/Axios";

interface AddCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isVisible, onClose }) => {
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCourseCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseCode(e.target.value);
  };

  // CURRENTLY NOT WORKING I DONT KNJOW HOW TO LINK WITH BACKEND
  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstanceWithAuth.post(
        "/courses/add",
        { courseCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setLoading(false);
      onClose();
      setCourseCode("");
    } catch (error) {
      console.error("Error adding course", error);
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
          <form className="space-y-4" onSubmit={handleSaveCourse}>
            <div>
              <label
                htmlFor="courseCode"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={courseCode}
                onChange={handleCourseCodeChange}
              />
            </div>
            {loading ? (
              <ButtonLoading />
            ) : (
              <ButtonSubmit text={"Save"} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
