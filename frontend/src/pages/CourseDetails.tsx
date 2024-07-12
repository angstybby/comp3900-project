import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import EditCourseDetailsModal from "@/components/Modals/EditCourseDetailsModal";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

interface CourseDetails {
  id: string;
  courseName: string;
  skills: string[];
  summary: string;
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
  });

  const fetchDetails = async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/course/course-details/${courseId}`);
      const details = {
        id: response.data.id,
        courseName: response.data.courseName,
        skills: response.data.skills ? response.data.skills : [],
        summary: response.data.summary,
      }
      setCourseDetails(details);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [])

  // Page auth protection
  let userType = Cookies.get('userType');

  return (
    <>
      <EditCourseDetailsModal 
        open={open} 
        close={openCloseModal} 
        courseId={courseId}
        refetchData={fetchDetails}
        initialValues={{
          summary: courseDetails.summary,
          skills: courseDetails.skills.join(', ')
        }}
      />
      <div className="px-14 py-5">
        <p className="mt-8 text-2xl font-bold mb-5">{`CourseDetails for ${courseId}`}</p>
        <div className="mb-5">
          <p className="mb-2">
            {`Course Code: `}
            <span className="font-bold">
              {`${courseDetails.id}`}
            </span>
          </p>
          <p>
            {`Course Title: `}
            <span className="font-bold">
              {`${courseDetails.courseName}`}
            </span>
          </p>
          <p className="font-bold mt-5">Course Summary:</p>
          <p className="mb-5">{courseDetails.summary ? courseDetails.summary : 'No summary for this course.'}</p>
          <p className="font-bold">Course Skills:</p>
          <div>
            {courseDetails.skills.length > 0 && courseDetails.skills[0] !== '' ? 
            (
              courseDetails.skills.filter(skill => skill).map((skill, index) => (
                <p key={index} className="">{`\u2022 ${skill}`}</p>
              ))
            )
            : 
            'No skills found for this course'}
          </div> 
        </div>
        
        {userType === 'student' ? <></> : <ButtonUtility text="Edit Course Details" onClick={openCloseModal} />}
      </div>    
    </>
  )
}

export default CourseDetails