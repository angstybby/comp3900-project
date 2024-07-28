import ButtonSubmit from '@/components/Buttons/ButtonSubmit';
import TextArea from '@/components/Inputs/TextArea';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

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
  {
    name: 'AWS',
    content: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25442312',
  },
  {
    name: 'OPTIVER',
    content: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25442307',
  },
];

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-full lg:w-2/3 pl-16 lg:pl-8 py-6 pr-8 rounded-md box-border">
        <div className='bg-gray-200 shadow-lg p-4 rounded-lg mb-8'>
          <div className="w-full mb-4 text-2xl font-bold">
            Share What's On Your Mind!
          </div>
          <div className="rounded-md">
            <TextArea id={'LinkedIn Share Input'} name={'LinkedIn Share'} autoComplete={'none'} placeholder={'Share your thoughts!'} />
            <div className='h-1/3 w-[10%] mt-4'>
              <ButtonSubmit text={'Post'} />
            </div>
          </div>
        </div>

        <div className="w-full mb-4 text-2xl font-bold">
          Your Projects!
        </div>

        <div className="w-full mb-4 text-2xl font-bold">
          Your Courses!
        </div>

      </div>
      <div className="w-1/3 pt-2 shadow-xl hidden lg:flex h-screen flex-col box-border">
        <p className='w-full p-2 ml-4 my-2 text-xl font-semibold'>
          Get the Latest Updates from Industry Leaders!
        </p>
        <TabGroup className='flex flex-col h-full flex-grow'>
          <div className='w-full bg-gray flex-grow-0 '>
            <TabList className="flex gap-4"> 
              <Carousel className="w-[90%] ml-2" opts={{
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
              </Carousel>
            </TabList>
          </div>
          <div className='w-full flex-grow'>
            <TabPanels className="mt-4 h-full">
              {
                tabOptions.map(option => (
                  <TabPanel key={option.name} className='w-full h-full'>
                    <iframe src={option.content} style={{ width: '100%', height: '96%' }}></iframe>
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