import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarouselItem } from "../ui/carousel";

interface ProjectCardProps {
  id: string,
  inCarousel: boolean,
}

export default function ProjectCard({ id, inCarousel }: ProjectCardProps) {
	const navigate = useNavigate();
	const onClick = () => {
		// navigate(`/course/${id}`)
    console.log("Clicked on project card")
	}

  useEffect(() => {
    console.log(id)
  }, [])

  const content = (
    <div className="h-32 bg-gray-200 p-5 py-3 text-center rounded-lg hover:bg-gray-300 w-80 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="text-start flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-light">Project Title</h1>
        </div>
        <h2 className="text-sm font-light line-clamp-2">Project Description</h2>
      </div>
    </div>
  )

  return (
    inCarousel ? (
      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
        {content}
      </CarouselItem>
    ) : (
      content
    )
  );

}