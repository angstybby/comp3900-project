import GroupCard from "@/components/GroupsComponents/GroupCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


export default function Groups() {
  return (
    <div className="h-screen flex">
      <div className="w-full flex flex-col p-14">
        <div className="h-1/3 flex flex-col">
          <h1 className="text-4xl font-medium">Your Groups</h1>
          <Carousel sliderClass="h-full" containerClass=" my-5 flex-1" responsive={responsive}>
            <GroupCard />
            <GroupCard />
            <GroupCard />
          </Carousel>
        </div>
        <div className="h-2/3">
          <h1 className="text-4xl font-medium">Groups for you</h1>
          <div className="h-full grid lg:grid-cols-3 md:grid-cols-1 grid-rows-3 mt-5">
            <GroupCard />
            <GroupCard />
          </div>
        </div>
      </div>
    </div >
  )
}