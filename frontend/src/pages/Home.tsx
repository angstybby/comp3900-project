import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '@/components/Buttons/ButtonLoading';
import ButtonUtility from '@/components/Buttons/ButtonUtility';
import CourseCard from '@/components/CoursesComponents/CourseCard';
import { ErrorAlert } from '@/components/ErrorAlert';
import TextArea from '@/components/Inputs/TextArea';
import SkillsLeaderBoard from '@/components/LeaderboardComponents/SkillsLeaderBoard';
import { SuccessAlert } from '@/components/SuccessAlert';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { DEFAULT_ERROR_MSSG } from '@/utils/constants';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  courseName: string;
}

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [shareText, setShareText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(DEFAULT_ERROR_MSSG);
  const [shareLink, setShareLink] = useState<string>('');

  useEffect(() => { console.log(shareText) }, [shareText]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axiosInstanceWithAuth.get('/course/user');
      const userCourses = response.data.map((item: any) => item.course)
      setCourses(userCourses);
    }

    fetchCourses();
  }, [])

  const handleShare = async () => {
    if (!shareText || shareText.trim() === '') {
      setErrorMessage('Please enter a message to share');
      setError(true);
      return;
    }
    setLoading(true);
    try {
      setError(false);
      const response = await axiosInstanceWithAuth.post('/auth/proxy/linkedin/share', { shareText });
      setShareText('');
      setShareLink(response.data);
    } catch (error) {
      const errorStatus = (error as any).response.status;
      if (errorStatus === 404) {
        setErrorMessage('Route not found');
      } else if (errorStatus === 400) {
        setErrorMessage('Please sign in or re-sync with LinkedIn to share your post');
      } else if (errorStatus === 500) {
        setErrorMessage(DEFAULT_ERROR_MSSG);
      }
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="h-screen flex overflow-y-hidden overflow-x-hidden">
      <div className="w-full lg:w-2/3 p-14 rounded-md box-border overflow-y-scroll">
        <div className='bg-gray-100 shadow-lg p-5 rounded-lg mb-8'>
          <div className="w-full mb-2 text-2xl font-bold">
            Share What's On Your Mind!
          </div>
          <div className="rounded-md">
            <TextArea
              id={'LinkedIn Share Input'}
              name={'LinkedIn Share'}
              autoComplete={'none'}
              placeholder={'Share your thoughts!'}

              value={shareText}
              valueChange={(value) => setShareText(value)}
            />
            <div className='w-full flex justify-end'>
              <div className='w-fit mt-3'>
                {
                  loading ? <ButtonLoading /> : <ButtonUtility classname='px-2 py-1' text={'Post to LinkedIn'} onClick={handleShare} />
                }
              </div>
            </div>
          </div>
        </div>

        {error &&
          <div className='mb-4'>
            <ErrorAlert errorMessage={errorMessage} />
          </div>
        }

        {shareLink !== '' &&
          <div className='mb-4'>
            <SuccessAlert successMessage={'Post shared successfully!'} link={shareLink} />
          </div>
        }

        {
          Cookies.get('userType') === 'student' &&
          (
            <>
              <div className="w-full mb-4 text-2xl font-bold">
                Your Completed Courses
              </div>
              <div className='mb-10'>
                <Carousel className="h-44 mt-5 w-full max-w-[90%] mx-auto" opts={{
                  align: "start"
                }}>
                  {courses.length > 0 ?
                    (
                      <>
                        <CarouselContent className=''>
                          {courses.length > 0 &&
                            courses.map((course) => (
                              <CarouselItem className='md:basis-1/2 '>
                                <CourseCard key={course.id} id={course.id} courseName={course.courseName} inCarousel={true} />
                              </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>
                    )
                    : <p className='text-center'>No courses completed yet</p>}
                </Carousel>
              </div>
              <div className='flex justify-center'>
                <SkillsLeaderBoard />
              </div>
            </>
          )
        }

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