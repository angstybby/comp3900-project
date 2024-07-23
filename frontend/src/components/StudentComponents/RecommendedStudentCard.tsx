import { CarouselItem } from "../ui/carousel";

interface RecommendedStudentCardProps {
  zId: string;
  fullname: string;
  profilePicture: string;
}

const RecommendedStudentCard: React.FC<RecommendedStudentCardProps> = ({ zId, fullname, profilePicture}) => {
  let basis = "";
  if (fullname.length > 10) {
    basis = ""
  }

  return (
    <CarouselItem className={`${basis} w-fit`}>
      <div className="py-3 w-fit select-none">
        <div className="bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 hover:cursor-pointer flex">
          <img
            src={profilePicture}
            alt="Profile Picture"
            className="w-10 h-10 rounded-full cursor-pointer self-center"
          />
          <div className="w-fit flex flex-wrap">
            <p className="w-full">{fullname}</p>
            <p className="w-full text-xs">{zId}</p>
          </div>
        </div>
      </div>
    </CarouselItem>
  )
}

export default RecommendedStudentCard