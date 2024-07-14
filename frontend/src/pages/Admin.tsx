import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import UserDetails from "@/components/UserDetails";
import LoadingCircle from "@/components/LoadingCircle";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import { useDeleteModal } from "@/contexts/DeleteModalContext";

interface Profile {
  zid: string,
  profilePicture: string,
  fullname: string,
  description: string,
  resume: string,
}

interface UserDetails {
  zid: string,
  email: string,
  createdAt: string,
  userType: string,
  profile: Profile
}

export default function Admin() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [currentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { isModalOpen, currentZid, openCloseModal } = useDeleteModal();

  // Fetch user data
  const fetchData = async () => {
    setLoading(true);
    const response = await axiosInstanceWithAuth.get("/user/all");
    setUsersData(response.data);
    setLoading(false);
  }

  // Page auth protection
  let userType = Cookies.get('userType');
  useEffect(() => {
    if (userType !== 'admin') {
      navigate('/dashboard')
    }
    fetchData();
  }, [userType]);

  // Search and filter users
  const filteredUsers = usersData.filter(user =>
    user.profile.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (userTypeFilter ? user.userType === userTypeFilter : true)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  return (
    <>
      <div className="p-5">
        <DeleteConfirmationModal
          open={isModalOpen}
          close={openCloseModal}
          zid={currentZid}
          refetchData={fetchData}
        />
        <p className="text-3xl font-bold mb-5">Showing All Active Users!</p>
        <div className="mb-5 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="admin">All User Types</option>
            <option value="academic">Academics</option>
            <option value="student">Students</option>
          </select>
        </div>
        {loading ?
          <div className="flex justify-center"><LoadingCircle /></div>
          :
          <>
            {currentUsers.map((user) => (
              <UserDetails
                key={user.zid}
                zid={user.zid}
                fullname={user.profile.fullname}
                userType={user.userType}
                createdAt={user.createdAt}
              />
            ))}
          </>
        }
      </div>
    </>
  )
}
