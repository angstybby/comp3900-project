import { ChangeEvent, FormEvent } from "react";
import ButtonLoading from "../Buttons/ButtonLoading";
import ButtonSubmit from "../Buttons/ButtonSubmit";

interface ChangeProfilePicModalProps {
  show: boolean;
  loading: boolean;
  onClose: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfilePic: (e: FormEvent) => void;
}

const ChangeProfilePicModal: React.FC<ChangeProfilePicModalProps> = ({
  show,
  loading,
  onClose,
  handleFileChange,
  handleSaveProfilePic
}) => {
  if (!show) return null;

  return (
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
  );
};

export default ChangeProfilePicModal
