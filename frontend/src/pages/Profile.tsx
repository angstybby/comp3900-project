import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import { axiosInstanceWithAuth } from "@/api/Axios";
import 'flowbite/dist/flowbite.min.css';
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import { Options } from "browser-image-compression";
import imageCompression from "browser-image-compression";
import { useProfile } from "@/contexts/ProfileContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfileModal from "@/components/Modals/EditProfileModal";
import ChangeProfilePicModal from "@/components/Modals/ChangeProfilePicModal";
import { useLocation, useNavigate } from "react-router-dom";
import ParseLinkedInInfoModal from "@/components/Modals/ParseLinkedInInfoModal";
import Cookies from "js-cookie";
import { profile } from "console";

interface Feedback {
  id: number;
  rating: number;
  comment: string;
}

export default function Profile() {
  const { profileData, fetchProfileData, updateProfileContext } = useProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editProfileInfo, setEditProfileInfo] = useState({
    zid: "",
    profilePicture: "",
    fullname: "",
    description: "",
    resume: "",
    CareerPath: "",
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfPicModal, setShowChangeProfPicModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const removeUpdateParam = () => {
    const params = new URLSearchParams(location.search);
    params.delete('update');
    const newSearch = params.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    navigate(newPath);
  };

  const getQueryParam = (param: string): string | null => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  const updateValue = getQueryParam('update');
  const fetchLinkedInData = async () => {
    const response = await axiosInstanceWithAuth.get("/auth/proxy/linkedin/details");
    return response.data;
  }
  


  useEffect(() => {
    fetchProfileData();
    fetchFeedbacks();
    if (updateValue) {
      setShowLinkedInModal(true);
    }
  }, [profileData.zid]);
  
  useEffect(() => {
    if (profileData) {
      setEditProfileInfo({
        zid: profileData.zid || '',
        profilePicture: profileData.profilePicture || '',
        fullname: profileData.fullname || '',
        description: profileData.description || '',
        resume: profileData.resume || '',
        CareerPath: profileData.CareerPath || '',
      });
    }
  }, [profileData]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/profile/feedbacks/${profileData.zid}`);
      // console.log(response.data.feedbackReceived);
      // console.log(response.data)
      const feedbacks = response.data.flatMap((item: any) => item.feedbackReceived);
      console.log(feedbacks);
      setFeedbacks(feedbacks);

    } catch (error) {
      console.error("couldn't fetch feedbacks")
    }
  }

  const syncLinkedInData = async () => {
    try {
      const linkedInData = await fetchLinkedInData();
      await axiosInstanceWithAuth.put('/profile/update-profile', {
        zid: profileData.zid,
        profilePicture: linkedInData.picture,
        fullname: linkedInData.given_name + ' ' + linkedInData.family_name,
        description: profileData.description,
        resume: profileData.resume,
      });
      updateProfileContext();
      removeUpdateParam();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setEditProfileInfo((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSaveEditProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstanceWithAuth.put(
        "/profile/update-profile",
        editProfileInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      updateProfileContext();
    } catch (error) {
      console.error("Error updating profile", error);
    }
    setLoading(false);
    setShowEditProfileModal(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageOptions: Options = { maxSizeMB: 5 };
    imageCompression(file, imageOptions)
      .then(compressed => { setSelectedFile(compressed); })
      .catch(error => { console.log(error); });
    return;
  };

  const handleSaveProfilePic = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file!');
      return;
    }
    const imageDataURL = await imageCompression.getDataUrlFromFile(selectedFile);
    try {
      setLoading(true);
      await axiosInstanceWithAuth.put('/profile/update-profile', {
        zid: profileData.zid,
        profilePicture: imageDataURL,
        fullname: profileData.fullname,
        description: profileData.description,
        resume: profileData.resume,
        CareerPath: profileData.CareerPath,
      });
      updateProfileContext();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setShowChangeProfPicModal(false);
    return;
  }

  const profileLink = `${window.location.origin}/profile/${profileData.zid}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(profileLink).then(() => {
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  const connectToLinkedIn = async () => {
    window.location.href = 'http://localhost:3000/api/auth/proxy/linkedin';
  }

  return (
    <div className="h-screen flex flex-row">

      <div className="m-10 flex-1">
        <h1 className="text-3xl font-semibold text-center mt-10">Your Profile</h1>
        <div className="m-2">
          <div className="flex flex-col items-center justify-center relative group">
            <div className="relative w-32 h-32">
              <img
                src={profileData.profilePicture}
                alt="Profile Picture"
                className="w-full h-full rounded-full cursor-pointer"
                onClick={() => setShowChangeProfPicModal(true)}
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 bg-black bg-opacity-50 rounded-full transition-opacity duration-300"
                onClick={() => setShowChangeProfPicModal(true)}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 13V16H7L16 7L13 4L4 13Z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-4">{profileData.fullname}</h2>
            <p className="text-xl text-gray-600 mt-2">{profileData.description}</p>
            <h3 className="text-sm text-gray-500 mt-2">{profileData.zid}</h3>
            <h4 className="text-sm text-gray-500 mt-1"> Career Path: {profileData.CareerPath}</h4>
          </div>


          <div className="mt-8 w-80 mx-auto flex space-x-4 items-center" title="Edit Profile Button">
            <ButtonUtility text={"Edit Profile"} onClick={() => setShowEditProfileModal(true)} />
          </div>

          <div className="mt-4 w-80 mx-auto flex space-x-4 items-center" title="Share Profile Button">
            <ButtonUtility text={"Share"} onClick={copyLinkToClipboard} bg={"bg-blue-500"} />
          </div>

          {
            Cookies.get('linkedIn_AccessToken') 
            ? 
              (
                <></>
              ) 
            : 
              (
                <div className="mt-4 w-80 mx-auto flex space-x-4 items-center" title="Link to LinkedIn Button">
                  <ButtonUtility text={"Connect to LinkedIn"} onClick={connectToLinkedIn} bg={"bg-lime-400 hover:bg-lime-600"} />
                </div>
              )
          }

        </div>
      </div>  

      <div className="flex-1 m-10">
        <div className="mt-10 mx-auto">
          <h1 className="text-3xl font-semibold text-center mt-10">Your Feedback</h1>
          <div className="mt-4 space-y-4">
            {feedbacks.map(feedback => (
              <div key={feedback.id} className="border p-4 rounded-md w-240">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star}
                      className={`text-2xl ${feedback.rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                    >
                      ⭐️
                    </span>
                  ))}
                </div>
                <p className="mt-2">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <ButtonUtility text={"Test"} onClick={() => 
        await axiosInstanceWithAuth.get("auth/proxy/linkedin/temp");
      }/> */}
      

      <ToastContainer />

      <EditProfileModal
        show={showEditProfileModal}
        loading={loading}
        editProfileInfo={editProfileInfo}
        onClose={() => setShowEditProfileModal(false)}
        handleEditProfileChange={handleEditProfileChange}
        handleSaveEditProfile={handleSaveEditProfile}
      />

      <ChangeProfilePicModal
        show={showChangeProfPicModal}
        loading={loading}
        onClose={() => setShowChangeProfPicModal(false)}
        handleFileChange={handleFileChange}
        handleSaveProfilePic={handleSaveProfilePic}
      />

      <ParseLinkedInInfoModal
        open={showLinkedInModal}
        close={() => setShowLinkedInModal(false)}
        sync={syncLinkedInData}
      />
    </div>
  );
}
