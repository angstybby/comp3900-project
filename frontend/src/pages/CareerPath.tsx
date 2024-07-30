import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonSubmitWithClick from "@/components/Buttons/ButtonSubmitWClick";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import { useNavigate } from "react-router-dom";

const UpdateCareerPath = () => {
  const { profileData, fetchProfileData, updateProfileContext } = useProfile();
  const [careerPath, setCareerPath] = useState(profileData.CareerPath || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setCareerPath(profileData.CareerPath || '');
    }
  }, [profileData]);

  const handleCareerPathChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCareerPath(e.target.value);
  };

  const handleSaveCareerPath = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedProfile = {
        ...profileData,
        CareerPath: careerPath
      };

      await axiosInstanceWithAuth.put(
        "/profile/update-profile",
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      updateProfileContext();
      navigate('/courseRecommendations');
    } catch (error) {
      console.error("Error updating Career Path", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAndNextWrapper = () => {
    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  return (
    <>
      <div className="flex min-h-screen justify-center items-center px-6 py-2 lg:px-8">
        <div className="w-full max-w-xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Please enter your career path below.
          </h2>
          <h3 className="mt-2 text-1xl text-center tracking-wide font-normal leading-9 text-gray-500">
            By sharing your intended career path with us, we can recommend additional projects that align with
            your goals and help you advance in your career. Please note that you can update this information at any time.
          </h3>
          <div className="mt-8">
            <form className="max-w-l mx-auto space-y-4" onSubmit={handleSaveCareerPath}>
              <div>
                <label htmlFor="careerPath" className="block text-lg mb-2 font-medium text-gray-900">
                  Career Path
                </label>
                <textarea
                  id="careerPath"
                  value={careerPath}
                  onChange={handleCareerPathChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                  placeholder="Enter your career path"
                />
              </div>

              <div className="mt-15 flex justify-end">
                <div className="w-1/6">
                  {loading ? <ButtonLoading /> : <ButtonSubmitWithClick text="Next" onClick={handleSubmitAndNextWrapper} />}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCareerPath;
