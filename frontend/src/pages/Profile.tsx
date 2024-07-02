import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import { axiosInstanceWithAuth } from "../api/Axios";
import ButtonLoading from "../components/ButtonLoading";
import 'flowbite/dist/flowbite.min.css'; 
import ButtonUtility from "../components/ButtonUtility";
import ButtonSubmit from "../components/ButtonSubmit";
import { Options } from "browser-image-compression";
import imageCompression from "browser-image-compression";

export default function Profile() {
  const [profile, setProfile] = useState({
    zid: "",
    profilePicture: "",
    fullname: "",
    description: "",
    resume: "",
  });

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstanceWithAuth.get("/profile");
      const profileData = response.data;
      setProfile(profileData);
      setEditProfileInfo(profileData);
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

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

  const handleSaveEditProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstanceWithAuth.put(
        "/profile/update-profile",
        editProfileInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setProfile(response.data);
      fetchProfile();
      console.log("Profile updated", editProfileInfo);
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
      return;
    }
    // Change the selected image to string data (base64)
    const imageDataURL = await imageCompression.getDataUrlFromFile(selectedFile)
    console.log(imageDataURL.length)
    try {
      setLoading(true);
      const response = await axiosInstanceWithAuth.put('/profile/update-profile', { 
        zid: profile.zid,
        profilePicture: imageDataURL,
        fullname: profile.fullname,
        description: profile.description,
        resume: profile.resume
      });
      setLoading(false);
      console.log(response);
      setShowChangeProfPicModal(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
    return;    
  }

  return (
    <div className="h-screen flex items-center justify-start flex-col">
      <h1 className="text-3xl font-semibold text-center mt-10">Your Profile</h1>

      <div className="flex flex-col items-center justify-center mt-10 relative group">
        <div className="relative w-32 h-32">
          <img
            src={profile.profilePicture}
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
        <h2 className="text-2xl font-semibold mt-4">{profile.fullname}</h2>
        <p className="text-xl text-gray-600 mt-2">{profile.description}</p>
        <h3 className="text-sm text-gray-500 mt-2">{profile.zid}</h3>
      </div>

      <div className="mt-8 w-80 mx-auto" title="Edit Profile Button">
        {loading ? ( <ButtonLoading />
        ) : (<ButtonUtility text={"Edit Profile"} onClick={() => setShowEditProfileModal(true)} /> )
        }
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
                <div>
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
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
