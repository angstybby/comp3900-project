import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstanceWithAuth } from "../api/Axios";
import UserDetails from "../components/UserDetails";
import LoadingCircle from "../components/LoadingCircle";

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
  let userType = Cookies.get('userType');
  const fetchData = async () => {
    setLoading(true);
    const response = await axiosInstanceWithAuth.get("/user/all");
    setUsersData(response.data);
    setLoading(false);
  }
  
  useEffect(() => {
    if (userType !== 'admin') {
      navigate('/dashboard')
    }
    fetchData()
  }, [userType]);

  return (
    <div className="p-5">
      <p className="text-3xl font-bold mb-5">Showing All Active Users!</p>
      {loading ? 
        <div className="flex justify-center"><LoadingCircle/></div> 
        : 
        <>
          {usersData.map((user) => (
            <UserDetails 
              zid={user.zid} 
              fullname={user.profile.fullname} 
              userType={user.userType} 
              createdAt={user.createdAt} 
              refetchData={fetchData}
            />
          ))}
        </>
      }
    </div>
  )
}