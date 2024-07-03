import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import { axiosInstanceWithAuth } from "../api/Axios";
import ButtonLoading from "../components/ButtonLoading";
import 'flowbite/dist/flowbite.min.css'; 
import ButtonUtility from "../components/ButtonUtility";
import ButtonSubmit from "../components/ButtonSubmit";
import { Options } from "browser-image-compression";
import imageCompression from "browser-image-compression";
import { useProfile } from "../contexts/ProfileContext";

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

  /**
   * Two useEffects used to get the profile data from the context and apply it to the edit modal
   */
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
      })
    }
  }, [profileData])

  /**
   * Handles the changing and editing of profile details
   * @param e 
   */
  const handleEditProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setEditProfileInfo((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  /**
   * Handles the saving profile details
   * @param e 
   */
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

  /**
   * Code for handling selected file change. NOTE THAT THIS DOES NOT SUBMIT THE CHANGE
   * Function for handling the submit is handleSaveProfilePic
   * 
   * @param e 
   * @returns {void}
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    // Compress the image to 5mb at most
    const imageOptions: Options = {
      maxSizeMB: 5
    }
    imageCompression(file, imageOptions)
    .then( function (compressed){
      setSelectedFile(compressed);
    })
    .catch( function(error) {
      console.log(error.message);
    })
    return;
  };

  /**
   * Function to submit the new profile pic and save the change. 
   * 
   * @param e 
   * @returns {void}
   */
  const handleSaveProfilePic = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      // No file has been selected! Return gracefully.
      alert('Please select a file!')
      return;
    }
    // Change the selected image to string data (base64)
    const imageDataURL = await imageCompression.getDataUrlFromFile(selectedFile)
    try {
      setLoading(true);
      await axiosInstanceWithAuth.put('/profile/update-profile', { 
        zid: profileData.zid,
        profilePicture: imageDataURL,
        fullname: profileData.fullname,
        description: profileData.description,
        resume: profileData.resume
      });
      updateProfileContext();
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
    setShowChangeProfPicModal(false);
    return;    
  }

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

      <div className="mt-8 w-80 mx-auto" title="Edit Profile Button">
        <ButtonUtility text={"Edit Profile"} onClick={() => setShowEditProfileModal(true)} />
      </div>

      {/* Edit profile details modal */}
      {showEditProfileModal && (
        <div
          id="edit-profile-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h3>
              {/* Button to Exit the Modal */}
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowEditProfileModal(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSaveEditProfile}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={editProfileInfo.fullname}
                    onChange={handleEditProfileChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={editProfileInfo.description}
                    onChange={handleEditProfileChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="zid"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    zID
                  </label>
                  <input
                    type="zid"
                    id="zid"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={editProfileInfo.zid}
                    onChange={handleEditProfileChange}
                  />
                </div>
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <ButtonSubmit text={"Save"} />
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change profile picture modal */}
      {showChangeProfPicModal && (
        <div
          id="change-profile-pic-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <div className="relative w-80 max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-6 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Profile Picture
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowChangeProfPicModal(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <form onSubmit={handleSaveProfilePic}>
                <div className="mb-3">
                  <label
                    htmlFor="profilePic"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    className="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {loading ? <ButtonLoading /> : <ButtonSubmit text={"Save"} />}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
