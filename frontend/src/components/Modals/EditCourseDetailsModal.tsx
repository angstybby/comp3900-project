import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import TextArea from '../Inputs/TextArea';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '../Buttons/ButtonLoading';
import ButtonSubmit from '../Buttons/ButtonSubmit';

interface EditCourseDetailsModalProps {
  open: boolean;
  close: () => void;
  courseId: string | undefined;
  refetchData: () => void;
  initialValues: {
    summary: string;
    skills: string[];
  }
}

interface Skill {
  id: number;
  skillName: string;
}

const EditCourseDetailsModal: React.FC<EditCourseDetailsModalProps> = ({ open, close, courseId, refetchData, initialValues }) => {
  const errorRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showNewSkillOption, setShowNewSkillOption] = useState<boolean>(false);


  useEffect(() => {
    setSummary(initialValues.summary);
    setSelectedSkills(initialValues.skills.map((skillName, index) => ({ id: index, skillName })));
  }, [open, initialValues]);

  const filteredSkills = query === ''
    ? []
    : skills.filter(skill =>
      skill.skillName.toLowerCase().includes(query.toLowerCase())
    );

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setSelectedFile(file);
      const formData = new FormData();
      formData.append('pdfUpload', file);
      try {
        const response = await axiosInstanceWithAuth.post('/course/parse-outline', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSummary(response.data.summary);
        setSelectedSkills(response.data.skills
          .split('- ')
          .filter((skill: string) => skill)
          .map((skill: string, index: number) => ({ id: index, skillName: skill.trim() })));
        errorRef.current = false;
      } catch (error) {
        errorRef.current = true;
        setErrorMessage('An error occured when parsing the file! Please try again.')
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        console.error('Error uploading file', error);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!summary || selectedSkills.length === 0) {
      setErrorMessage('Summary and skills cannot be blank!');
      setLoading(false);
      errorRef.current = true;
      return;
    }
    try {
      await axiosInstanceWithAuth.post('course/update-details', {
        course: courseId,
        summary: summary,
        skills: selectedSkills.map(skill => skill.skillName),
      });
    } catch (error) {
      setErrorMessage('An error occurred when parsing the file! Please try again.');
      console.error('Failed to update course details:', error);
    }
    setLoading(false);
    close();
    refetchData();
  };

  useEffect(() => {
    if (open) {
      const fetchSkills = async () => {
        try {
          const response = await axiosInstanceWithAuth.get('/skills');
          setSkills(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSkills();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-[100] focus:outline-none transition duration-150 ease-out"
      transition
      onClose={() => {
        close();
        setSelectedFile(null);
        setSummary('');
        setSelectedSkills([]);
        errorRef.current = false;
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
              valueChange={handleSummaryChange}
              id={'courseSummary'}
              name={'courseSummary'}
              autoComplete={'off'}
              disabled={loading}
            />
            <p className="my-2 font-bold">Course Skills</p>
            <Combobox
              disabled={loading}
              multiple
              value={selectedSkills}
              onChange={setSelectedSkills}
              onClose={() => setQuery('')}
            >
              {selectedSkills.length > 0 && (
                <div className='mb-5'>
                  <div className='flex flex-wrap gap-2'>
                    {selectedSkills.map(skill => (
                      <button
                        key={skill.id}
                        className='bg-green-200 p-1.5 rounded-lg hover:bg-red-200'
                        onClick={() => {
                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        }}
                      >
                        {skill.skillName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <ComboboxInput
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowNewSkillOption(!skills.some(skill => skill.skillName.toLowerCase() === event.target.value.toLowerCase()));
                }}
                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                placeholder="Search for skills and select all that is in this course..."
              />
              {(query.length > 0 || showNewSkillOption) && (
                <ComboboxOptions
                  transition
                  className='w-full max-h-48 overflow-scroll rounded-xl border border-gray-800/5 bg-gray-800/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                >
                  {filteredSkills.map(skill => (
                    <ComboboxOption
                      key={skill.id}
                      value={skill}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-indigo-500/30"
                    >
                      {skill.skillName}
                    </ComboboxOption>
                  ))}
                  {showNewSkillOption && query !== '' && (
                    <ComboboxOption
                      value={{ id: skills.length + 1, skillName: query }}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-green-500/30"
                    >
                      Add "{query}" as a new skill
                    </ComboboxOption>
                  )}
                </ComboboxOptions>
              )}
            </Combobox>
            {errorMessage && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}

            <div className="mt-6 text-left">
              <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                Upload Course Outline:
              </label>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('pdfUpload')?.click()}
                  className="w-full py-2 px-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
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
            <form className="max-w-l mx-auto space-y-4 my-2" onSubmit={handleSubmit}>
              <div className="mt-15 flex justify-end">
                {errorRef.current && (
                  <p className='mr-3 self-center font-thin text-sm text-red-500'>{errorMessage}</p>
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
  );
};

export default EditCourseDetailsModal;
