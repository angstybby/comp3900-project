import { ChangeEvent, FormEvent } from "react";
import ButtonLoading from "../Buttons/ButtonLoading";
import ButtonSubmit from "../Buttons/ButtonSubmit";

interface EditProfileModalProps {
  show: boolean;
  loading: boolean;
  editProfileInfo: {
    zid: string;
    profilePicture: string;
    fullname: string;
    description: string;
    resume: string;
  };
  onClose: () => void;
  handleEditProfileChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveEditProfile: (e: FormEvent) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  loading,
  editProfileInfo,
  onClose,
  handleEditProfileChange,
  handleSaveEditProfile,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75"
      id="edit-profile-modal"
      >
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
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
  );
}; 

export default EditProfileModal