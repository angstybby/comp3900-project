import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  courseName: string;
}

export default function CourseCard({ id, courseName }: CourseCardProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/course/${id}`)
  }

  return (
    <div className="h-40 bg-gray-100 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-full hover:cursor-pointer transition duration-150 shadow-lg"
      onClick={onClick}
    >
      <div className="text-start flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-light">{id}</h1>
        </div>
        <h2 className="text-sm font-light line-clamp-2">{courseName}</h2>
      </div>
    </div>
  );

}