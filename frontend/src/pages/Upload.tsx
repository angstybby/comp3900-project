import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { useNavigate } from "react-router-dom";
import ButtonWarning from "@/components/Buttons/ButtonWarning";
import SearchCourse from "@/components/Inputs/SearchCourse";
import ButtonSubmitWithClick from "@/components/Buttons/ButtonSubmitWClick";

interface Course {
  id: string;
  courseName: string;
}

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [scrapedText, setScrapedText] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append('pdfUpload', file);
      setLoading(true);
      try {
        const response = await axiosInstanceWithAuth.post('profile/scrape-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // const extractedCourses = response.data.courses;
        setScrapedText(response.data); // Assuming this contains the scraped text
        const extractedCourses = response.data
        const courseCodeRegex = /\b[A-Z]{4}[0-9]{4}\b/g;
        const courseCodes = extractedCourses.match(courseCodeRegex) || [];
        console.log(courseCodes);

        setSelectedCourses((prevCourses) => {
          const newCourses = courseCodes.filter((newCourse: string) =>
            !prevCourses.some((course) => course.id === newCourse)
          ).map((courseCode: string) => ({
            id: courseCode,
            courseName: courseCode // Assuming course name is same as course code for simplicity
          }));
          console.log("============================");
          console.log(newCourses);
          return [...prevCourses, ...newCourses];
        });
         
        
      } catch (error) {
        console.error('Error uploading file', error);
      }
      setLoading(false);
    }
  };

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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCourse = (course: Course) => {
    if (!selectedCourses.some((c) => c.id === course.id)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
    setSearchTerm("");
    setSuggestions([]);
  };

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
      setSelectedCourses([]);
      navigate('/courseRecommendations');
    } catch (error) {
      console.error("Error adding courses", error);
      setLoading(false);
    }
  };


  const handleUpload = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const formData = new FormData();
    if (!selectedFile) {
      throw new Error('No file selected');
    }
    formData.append('pdfUpload', selectedFile);
    formData.append('scrapped', scrapedText);

    // Add selected courses to the form data
    selectedCourses.forEach(course => {
      formData.append('courses[]', course.id);
    });

    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.post('/profile/upload-transcript', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        console.log('File uploaded successfully');
        navigate('/courseRecommendations');
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
    setLoading(false);
  };

  const handleNext = async () => {
    setLoading(true);
    await handleAddCourse();
    await handleUpload();
    setLoading(false);
    navigate('/courseRecommendations');
  };

  return (
    <>
      <div className="flex min-h-screen justify-center items-center px-6 py-2 lg:px-8">
        <div className="w-full max-w-xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Thank you for signing up! <br /> Please add all the courses you have done so far or <b>upload your transcript </b>
            to auto-fill the courses.
          </h2>

          <div className="mt-8">
            <form className="max-w-l mx-auto space-y-4" onSubmit={handleUpload}>
              <div>
                <label htmlFor="search" className="block text-lg mb-2 font-medium text-gray-900">
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
                {selectedCourses.map((course) => (
                  <div key={course.id} className="flex justify-between items-center p-2 border-b border-black">
                    <span>{course.courseName} ({course.id})</span>
                    <div onClick={() => handleRemoveCourse(course.id)}>
                      <ButtonWarning text={"Remove"} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-left">
                <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                  Upload PDF:
                </label>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('pdfUpload')?.click()}
                    className="w-full py-2 px-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  >
                    Upload PDF
                  </button>
                  <input
                    id="pdfUpload"
                    name="pdfUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mt-6 text-left">
                <p>Selected file: {selectedFile?.name}</p>
              </div>

              <div className="mt-15 flex justify-end">
                <div className="w-1/6">
                  {loading ? <ButtonLoading /> : <ButtonSubmitWithClick text="Next" onClick={handleNext}/>}
                </div>
              </div>
            </form>
          </div>
        </div >
      </div >
    </>
  );
}