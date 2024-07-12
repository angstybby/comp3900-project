import ButtonWarning from '../Buttons/ButtonWarning'
import ButtonUtility from '../Buttons/ButtonUtility'
import { axiosInstanceWithAuth } from '@/api/Axios';
import { useEffect, useState } from 'react';
import LoadingCircle from '../LoadingCircle';
import Cookies from 'js-cookie';

const CourseDetailsActions = ({ courseId } : { courseId : string }) => {
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState(false);
  const handleAddCourse = async () => {
    try {
      setLoading(true);
      await axiosInstanceWithAuth.post(
        "/course/add",
        { id: courseId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setLoading(false);
      setTaken(true);
    } catch (error) {
      console.error("Error adding course", error);
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setLoading(true);
      await axiosInstanceWithAuth.delete(
        "/course/delete",
        { data: {course: courseId} },
      );
      setLoading(false);
      setTaken(false);
    } catch (error) {
      console.error("Error deleting course", error);
      setLoading(false);
    }
  };

  // Page auth protection
  let userType = Cookies.get('userType');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.get("course/user");
      for (const course of response.data) {
        if (course.course.id === courseId) {
          setTaken(true);
          console.log("Course already taken")
          break;
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching completion details", error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [courseId]);

  return (
    <>
      {
        loading ? <LoadingCircle/> :
        <div className='w-auto'>
          {
            (taken && userType === 'student')
            ? 
            <div onClick={handleDeleteCourse}>
              <ButtonWarning 
                text="Remove from Completed Courses" 
              />
            </div>
            :
            <ButtonUtility 
              text="Mark Couse as Completed" 
              onClick={handleAddCourse} 
            />
          }
        </div>
      }
    </>
  )
}

export default CourseDetailsActions