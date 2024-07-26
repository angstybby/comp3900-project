import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fragment } from 'react/jsx-runtime';

const Home = () => {
const tabOptions = [
  {
    name: 'NVIDIA',
    content: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25442073',
  },
  {
    name: 'ATLASSIAN',
    content: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25442086',
  },
  {
    name: 'CANVA',
    content: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25442088',
  },
];

  return (
    <div className="h-screen flex">
      <div className="w-2/3 flex flex-wrap p-2 rounded-md mx-auto my-auto">
        <div className="w-full text-center my-2">You Have Reached the Home (Dashboard) Page</div>
      </div>
      <div className="w-1/3 pt-2 shadow-xl hidden lg:block h-screen">
        <TabGroup manual as={Fragment}>
          <div className='relative w-full bg-gray'>
            <TabList className="flex gap-4"> 
              <Carousel className="h-full w-[90%] ml-2" opts={{
                    align: "start",
                  }}>
                <CarouselContent className='mx-1'>
                {
                  tabOptions.map(option => (
                    <Tab
                    key={option.name}
                    className="rounded-full ml-2 py-1 px-3 text-sm/6 font-semibold text-black focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                      {option.name}
                    </Tab>
                  ))
                }
                </CarouselContent>
                {/* <CarouselPrevious />
                <CarouselNext /> */}
              </Carousel>
            </TabList>
          </div>
          <div>
            <TabPanels className="mt-2 flex h-screen">
              {
                tabOptions.map(option => (
                  <TabPanel key={option.name} className='w-full'>
                    <iframe src={option.content} width='100%' height='100%'></iframe>
                  </TabPanel>
                ))
              }
            </TabPanels>
          </div>
        </TabGroup>
      </div>
    </div>
  )
}

export default Home