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

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  editMode?: boolean;
  newStatus?: string;
}

interface Feedback {
  fromProfile: any;
  id: number;
  rating: number;
  comment: string;
}

import EditProfileModal from "@/components/Modals/EditProfileModal";
import ChangeProfilePicModal from "@/components/Modals/ChangeProfilePicModal";
import { useLocation, useNavigate } from "react-router-dom";
import ParseLinkedInInfoModal from "@/components/Modals/ParseLinkedInInfoModal";
import Cookies from "js-cookie";

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
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Project Name 1",
      description: "Description for Project Name 1",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Project Name 2",
      description: "Description for Project Name 2",
      status: "Completed",
    },
    {
      id: 3,
      title: "Project Name 3",
      description: "Description for Project Name 3",
      status: "Pending",
    },
  ]);

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

  //STUB FEEDBACK DATA
  // const [feedbacks] = useState([
  //   { id: 1, rating: 4, comment: "Great work on the project!" },
  //   { id: 2, rating: 5, comment: "Excellent contribution and teamwork!" },
  //   { id: 3, rating: 3, comment: "Good effort, but could improve in communication." },
  // ]);

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
      if (profileData.userType === 'student') {
        fetchProjects(profileData.zid);
      } else {
        // Uncomment line to get actual projects when implemented
        //setProjects([]);
      }
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

  const fetchProjects = async (zid: string) => {
    try {
      const response = await axiosInstanceWithAuth.get(`/projects/user/${zid}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

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

  const handleEditProjectStatus = (projectId: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, editMode: true, newStatus: project.status }
          : project
      )
    );
  };

  const handleProjectStatusChange = (e: ChangeEvent<HTMLInputElement>, projectId: number) => {
    const { value } = e.target;
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, newStatus: value } : project
      )
    );
  };

  const handleSaveProjectStatus = async (projectId: number) => {
    const project = projects.find((project) => project.id === projectId);
    if (!project) return;

    try {
      setLoading(true);
      await axiosInstanceWithAuth.put(`/projects/${projectId}/update-status`, {
        status: project.newStatus || "",
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status: project.newStatus || "", editMode: false } : project
        )
      );
    } catch (error) {
      console.error("Error updating project status", error);
    }
    setLoading(false);
  };

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
    <div className="h-screen flex flex-col">

      <div className="m-10">
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

          <div className="mt-8 w-80 mx-auto flex space-x-2 items-center" title="Edit Profile Button">
            <ButtonUtility text={"Edit Profile"} onClick={() => setShowEditProfileModal(true)} />
            <div className="w-28">
              <ButtonUtility onClick={copyLinkToClipboard} text="Share" bg="bg-blue-500 hover:bg-blue-400" />
            </div>
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
      {Cookies.get('userType') === 'student' && (
        <div className="m-10 flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-center mb-4">Your Projects</h2>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg shadow space-y-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="mt-2 text-gray-600">{project.description}</p>
                    <p className="mt-2 text-gray-500">
                      Status: {project.editMode ? (
                        <input
                          type="text"
                          value={project.newStatus || ""}
                          onChange={(e) => handleProjectStatusChange(e, project.id)}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        project.status
                      )}
                    </p>
                    {project.editMode ? (
                      <button
                        onClick={() => handleSaveProjectStatus(project.id)}
                        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded w-full"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditProjectStatus(project.id)}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-full"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-center">Your Feedback</h2>
            <div className="max-h-96 overflow-y-auto mt-4 space-y-4">
              {feedbacks.map(feedback => (
                <div key={feedback.id} className="border p-4 rounded-md">
                  <h1 className="text-xl font-semibold">{feedback.fromProfile.fullname}</h1>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={`text-2xl ${feedback.rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                      >
                      ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-2">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
