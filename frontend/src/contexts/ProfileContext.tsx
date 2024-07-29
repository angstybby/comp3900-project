import { ReactNode, createContext, useContext, useState } from "react";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { STUB_IMAGE } from "@/utils/constants";

interface ProfileData {
  zid: string;
  profilePicture: string;
  fullname: string;
  description: string;
  resume: string;
  CareerPath: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  fetchProfileData: () => void;
  updateProfileContext: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);
  const fetchProfileData = async () => {
    try {
      const response = await axiosInstanceWithAuth.get("/profile");
      const data = response.data;
      if (!data.profilePicture || data.profilePicture === '') {
        data.profilePicture = STUB_IMAGE;
      }
      setProfileData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const updateProfileContext = async () => {
    fetchProfileData();
  }

  return (
    <ProfileContext.Provider value={{ profileData, fetchProfileData, updateProfileContext }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider!');
  }
  return context;
}