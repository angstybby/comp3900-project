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
            <ButtonUtility text={"Upload Courses"} onClick={() => navigate('/Upload')} />
            <ButtonUtility text={"Add Course"} onClick={() => setShowAddCourseModal(true)} />
          </div>
        )}
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
