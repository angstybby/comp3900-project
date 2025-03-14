import { STUB_IMAGE } from "@/utils/constants";
import ButtonSelect from "../Buttons/ButtonSelect";

interface RecommendedStudentCardProps {
  zId: string;
  fullname: string;
  profilePicture: string;
  selected: boolean;
  selectFunction: () => void;
}

const RecommendedStudentCard: React.FC<RecommendedStudentCardProps> = ({ zId, fullname, profilePicture, selected, selectFunction}) => {
  let bg = "bg-indigo-600"; 
  if (selected) bg = "bg-indigo-300";

  return (
    <div className="py-1 select-none">
      <div className="bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 hover:cursor-pointer flex h-16">
        <img
          src={profilePicture ? profilePicture : STUB_IMAGE}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full cursor-pointer self-center"
        />
        <div className="w-full flex justify-between align-middle">
          <p className="self-center ml-3">{`${fullname} - ${zId}`}</p>
          <div className="self-center w-1/10" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              selectFunction();
          }}>
            <ButtonSelect text={!selected ? "Select" : "Selected"} classname={`w-20 ${bg}`}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendedStudentCard