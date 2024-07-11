import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import TextArea from '../Inputs/TextArea';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '../Buttons/ButtonLoading';
import ButtonSubmit from '../Buttons/ButtonSubmit';

interface DeleteModalProps {
  open: boolean;
  close: () => void;
  refetchData: () => void;
}

const EditCourseDetailsModal: React.FC<DeleteModalProps> = ({ open, close, refetchData }) => {
  const [loading, setLoading] = useState(false);
  const fileParseError = useRef<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setSelectedFile(file);
      const formData = new FormData()
      formData.append('pdfUpload', file);
      try {
        const response = await axiosInstanceWithAuth.post('/course/parse-outline', 
          formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setSummary(response.data.summary);
        setSkills(response.data.skills
          .split('- ')
          .filter((skill: string) => skill)
          .map((skill: string) => skill.trim()) as string[]);
        fileParseError.current = false;
      } catch (error) {
        console.error('Error uploading file', error);
        fileParseError.current = true;
        setSelectedFile(null);
      }
      setLoading(false);
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    window.location.reload();
  }
  
  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative z-[100] focus:outline-none transition duration-150 ease-out"
        transition
        onClose={() => {
          close();
          setSelectedFile(null);
          setSummary('');
          setSkills([]);
          fileParseError.current = false;
        }}
      >
        <DialogBackdrop
          className="fixed inset-0 bg-black/30 data-[closed]:opacity-0 duration-150 ease-out"
          transition
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex flex-wrap min-h-full items-center justify-center p-6">
            <DialogPanel
              transition
              className="w-full max-w-2xl rounded-xl bg-white/60 p-6 px-8 backdrop-blur-2xl duration-150 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle className='mb-5'>
                <p className='font-bold text-2xl'>Update Course Details</p>
                <p className='font-thin text-sm opacity-70 mt-1'>Create your own summary and skills or simply upload the course outline</p>
              </DialogTitle>
              <p className="my-2 font-bold">Course Summary</p>
              <TextArea 
                placeholder={'Enter course summary here...'} 
                value={summary}
                id={''} 
                name={''} 
                autoComplete={'off'} 
                disabled={loading}
              />
              <p className="my-2 font-bold">Course Skills</p>
              <TextArea 
                placeholder={'Enter skills here separated by a comma...'} 
                value={skills.join(', ')}
                id={''} 
                name={''} 
                autoComplete={'off'} 
                disabled={loading}
              />

              <form className="max-w-l mx-auto space-y-4 my-2" onSubmit={handleSubmit}>
                <div className="text-left">
                  <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                    Upload Course Outline:
                  </label>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById('pdfUpload')?.click()}
                      className="w-full py-2 px-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    >
                      <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                    </button>
                    <input
                      id="pdfUpload"
                      name="pdfUpload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="mt-6 text-left">
                  <p>Selected file: {selectedFile?.name}</p>
                </div>
                <div className="mt-15 flex justify-end">
                  { fileParseError.current && (
                    <p className='mr-3 self-center font-thin text-sm text-red-400'>
                      An error occured when parsing the file! Please try again.
                    </p>
                  )}
                  <div className="w-1/6">
                    {loading ? <ButtonLoading /> : <ButtonSubmit text="Update" />}
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default EditCourseDetailsModal