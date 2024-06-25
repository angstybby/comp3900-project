import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import "flowbite/dist/flowbite.min.css";
import { axiosInstanceWithAuth } from "../api/Axios";
import ButtonLoading from "../components/ButtonLoading";
import 'flowbite/dist/flowbite.min.css'; 

export default function Profile() {
  // const profileTemp = {
  //     name: 'Edrick Koda',
  //     userType: 'Student',
  //     bio: 'insert bio here or some other details',
  //     email: 'z12345@student.unsw.edu',
  //     profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
  // };

  // const [profile, setProfile] = useState(profileTemp);
  // fields: zid, profilePicture, userType, fullname, description, resume
  // const accessToken = localStorage.getItem(accessToken);
  const [profile, setProfile] = useState({
    zid: "",
    profilePicture: "",
    // userType: '',
    fullname: "",
    description: "",
    resume: "",
  });
  const [editProfileInfo, setEditProfileInfo] = useState({
    zid: "",
    profilePicture: "",
    userType: "",
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

  const handleOpenEditProfileModal = () => {
    setShowEditProfileModal(true);
  };

  const handleCloseEditProfileModal = () => {
    setShowEditProfileModal(false);
  };

  const handleOpenChangeProfPicModal = () => {
    setShowChangeProfPicModal(true);
  };

  const handleCloseChangeProfPicModal = () => {
    setShowChangeProfPicModal(false);
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
      // setShowEditProfileModal(false);
      console.error("Error updating profile", error);
    }
    setLoading(false);
    setShowEditProfileModal(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSaveProfilePic = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
    setShowChangeProfPicModal(false);
  };

  return (
    <div className="h-screen flex items-center justify-start flex-col">
      <h1 className="text-3xl font-semibold text-center mt-10">Your Profile</h1>

      <div className="flex flex-col items-center justify-center mt-10 relative group">
        <div className="relative w-32 h-32">
          <img
            src={profile.profilePicture}
            alt="Profile Picture"
            className="w-full h-full rounded-full cursor-pointer"
            onClick={handleOpenChangeProfPicModal}
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 bg-black bg-opacity-50 rounded-full transition-opacity duration-300"
            onClick={handleOpenChangeProfPicModal}
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
        {/* <h2 className="text-xl mt-2">{profile.userType}</h2> */}
        <p className="text-xl text-gray-600 mt-2">{profile.description}</p>
        <h3 className="text-sm text-gray-500 mt-2">{profile.zid}</h3>
      </div>

      <div className="mt-8 w-80 mx-auto" title="Edit Profile Button">
        <button
          onClick={handleOpenEditProfileModal}
          className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Profile
        </button>
      </div>

      {/* edit profile details modal */}
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
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleCloseEditProfileModal}
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
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* change profile picture modal */}
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
                onClick={handleCloseChangeProfPicModal}
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
