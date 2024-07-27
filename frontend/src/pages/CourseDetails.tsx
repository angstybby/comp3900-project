import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import CourseDetailsActions from "@/components/CoursesComponents/CourseDetailsActions";
import EditCourseDetailsModal from "@/components/Modals/EditCourseDetailsModal";
import CourseCharts from "@/components/CoursesComponents/CourseCharts";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { ErrorAlert } from "@/components/ErrorAlert";

interface Skills {
  skillName: string;
}

interface CourseDetails {
  id: string;
  courseName: string;
  skills: Skills[];
  summary: string;
  popularity: number; //need to implement for fetching
  courseSkill: {
    rating: number;
  }[];
}

const CourseDetails = () => {
  const [open, setOpen] = useState(false);
  const openCloseModal = () => setOpen(!open);
  const { courseId } = useParams<{ courseId: string }>();
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    id: "",
    courseName: "",
    skills: [],
    summary: "",
    popularity: 10, //STUB
    courseSkill: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDetails = async () => {
    try {
      const response = await axiosInstanceWithAuth.get(
        `/course/course-details/${courseId}`,
      );
      const details = {
        id: response.data.id,
        courseName: response.data.courseName,
        skills: response.data.skills ? response.data.skills : [],
        summary: response.data.summary,
        popularity: 10, //STUB
        courseSkill: response.data.CourseSkill,
      };
      console.log(details);
      setCourseDetails(details);
      console.log("Course details:", details);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    }
  };

  const handleGenerateSkills = async () => {
    try {
      setLoading(true);
      await axiosInstanceWithAuth.post(
        `/course/generate-skill-rating/${courseId}`,
      );
      await fetchDetails();
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      // show the error somewhere
      setErrorMessage(
        "Failed to generate skills, Please ensure the course has skills",
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Page auth protection
  let userType = Cookies.get("userType");

  return (
    <>
      <EditCourseDetailsModal
        open={open}
        close={openCloseModal}
        courseId={courseId}
        refetchData={fetchDetails}
        initialValues={{
          summary: courseDetails.summary,
          skills: courseDetails.skills.join(", "),
        }}
      />
      <div className="px-14 py-5">
        <p className="mt-8 text-2xl font-bold mb-5">{`CourseDetails for ${courseId}`}</p>
        <div className="mb-5">
          <p className="mb-2">
            {`Course Code: `}
            <span className="font-bold">{`${courseDetails.id}`}</span>
          </p>
          <p>
            {`Course Title: `}
            <span className="font-bold">{`${courseDetails.courseName}`}</span>
          </p>
          <p className="font-bold mt-5">Course Summary:</p>
          <p className="mb-5">
            {courseDetails.summary
              ? courseDetails.summary
              : "No summary for this course."}
          </p>
          <p className="font-bold">Course Skills:</p>
          <div>
            {courseDetails.skills.length > 0
              ? courseDetails.skills
                  .filter((skill) => skill)
                  .map((skill, index) => (
                    <p
                      key={index}
                      className=""
                    >{`\u2022 ${skill.skillName}`}</p>
                  ))
              : "No skills found for this course"}
          </div>
        </div>
        {courseDetails.courseSkill.length === 0 ? (
          <p className="text-red-500 my-5">
            No skill ratings found for this course
          </p>
        ) : (
          <div className="w-[500px] h-[500px] mx-auto">
            <CourseCharts
              skillLabels={courseDetails.skills.map((skill) => skill.skillName)}
              skillLevels={courseDetails.courseSkill.map((skill) =>
                skill.rating.toString(),
              )}
            />
          </div>
        )}
        {errorMessage === "" ? null : (
          <ErrorAlert errorMessage={errorMessage} />
        )}
        <div className="my-8">
          {/* Error message TODO */}
          {loading ? (
            <ButtonLoading />
          ) : (
            <ButtonUtility
              text={"Generate Skills"}
              onClick={handleGenerateSkills}
            />
          )}
        </div>
        {userType === "student" ? (
          <CourseDetailsActions courseId={courseDetails.id} />
        ) : (
          <ButtonUtility text="Edit Course Details" onClick={openCloseModal} />
        )}
      </div>
    </>
  );
};

export default CourseDetails;
