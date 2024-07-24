import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import 'flowbite/dist/flowbite.min.css';
import ButtonUtility from "@/components/Buttons/ButtonUtility";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit";
import { Options } from "browser-image-compression";
import imageCompression from "browser-image-compression";
import { useProfile } from "@/contexts/ProfileContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfileModal from "@/components/Modals/EditProfileModal";
import ChangeProfilePicModal from "@/components/Modals/ChangeProfilePicModal";

export default function Profile() {
  const { profileData, fetchProfileData, updateProfileContext } = useProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editProfileInfo, setEditProfileInfo] = useState({
    zid: "",
    profilePicture: "",
    fullname: "",
    description: "",
    resume: "",
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfPicModal, setShowChangeProfPicModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setEditProfileInfo({
        zid: profileData.zid || '',
        profilePicture: profileData.profilePicture || '',
        fullname: profileData.fullname || '',
        description: profileData.description || '',
        resume: profileData.resume || '',
      });
    }
  }, [profileData]);

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
  
  return (
    <div className="h-screen flex items-center justify-start flex-col">
      <h1 className="text-3xl font-semibold text-center mt-10">Your Profile</h1>
      <div className="flex flex-col items-center justify-center mt-10 relative group">
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
      </div>

      <div className="mt-8 w-80 mx-auto flex space-x-4 items-center" title="Edit Profile Button">
        <ButtonUtility text={"Edit Profile"} onClick={() => setShowEditProfileModal(true)} />
        <button onClick={copyLinkToClipboard} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Share
        </button>
      </div>

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
    </div>
  );
}
