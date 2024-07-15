import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstanceWithAuth } from "@/api/Axios";
import UserDetails from "@/components/UserDetails";
import LoadingCircle from "@/components/LoadingCircle";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import { useDeleteModal } from "@/contexts/DeleteModalContext";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

type UserType = 'academic' | 'student';

export default function Admin() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [currentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { isModalOpen, currentZid, openCloseModal } = useDeleteModal();

  const styles: { [key: string]: React.CSSProperties } = {
    scrollableList: {
      maxHeight: '300px',
      overflowY: 'auto',
    },
  };

  // Fetch user data
  const fetchData = async () => {
    setLoading(true);
    const response = await axiosInstanceWithAuth.get("/user/all");
    setUsersData(response.data);
    setLoading(false);
  };

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

  // Calculate user stats based on filter
  const totalUsers = filteredUsers.length;
  const userTypes = filteredUsers.reduce((acc: Record<UserType, number>, user) => {
    const type = user.userType as UserType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, { academic: 0, student: 0 });

  const pieData = {
    labels: ['Academics', 'Students'],
    datasets: [
      {
        data: [userTypes.academic, userTypes.student],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56']
      }
    ]
  };

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
            <option value="">All User Types</option>
            <option value="academic">Academics</option>
            <option value="student">Students</option>
          </select>
        </div>
        {loading ?
          <div className="flex justify-center"><LoadingCircle /></div>
          :
          <div style={styles.scrollableList}>
            {currentUsers.map((user) => (
              <UserDetails
                key={user.zid}
                zid={user.zid}
                fullname={user.profile.fullname}
                userType={user.userType}
                createdAt={user.createdAt}
              />
            ))}
          </div>
        }
        <div className="mt-10">
          <h2 className="text-2xl font-bold">User Statistics</h2>
          <p>Total Users: {totalUsers}</p>
          <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </>
  );
}
