import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstanceWithAuth } from '@/api/Axios';
import { STUB_IMAGE } from '@/utils/constants';
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PublicProfile() {
  const { zId } = useParams();
  const [profileData, setProfileData] = useState({
    profilePicture: '',
    fullname: '',
    description: '',
    zid: '',
    CareerPath: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstanceWithAuth.get(`/profile/${zId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfileData();
  }, [zId]);

  const connectToLinkedIn = () => {
    window.location.href = 'http://localhost:3000/api/auth/proxy/linkedin';
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center mt-10 relative group">
        <div className="relative w-32 h-32 overflow-hidden rounded-full bg-gray-200">
          <img
            src={profileData.profilePicture || STUB_IMAGE}
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold mt-4">{profileData.fullname}</h2>
        <p className="text-xl text-gray-600 mt-2">{profileData.description}</p>
        <h3 className="text-sm text-gray-500 mt-2">{profileData.zid}</h3>
        <h4 className="text-sm text-gray-500 mt-1">Career Path: {profileData.CareerPath}</h4>

        {
          !Cookies.get('linkedIn_AccessToken') && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={connectToLinkedIn}
                className="bg-lime-400 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded"
              >
                Connect to LinkedIn
              </button>
            </div>
          )
        }
      </div>
      <ToastContainer />
    </div>
  );
}
