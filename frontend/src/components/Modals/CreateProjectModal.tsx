import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea
} from '@headlessui/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '../Buttons/ButtonLoading';
import ButtonSubmit from '../Buttons/ButtonSubmit';
import Textbox from '../Inputs/Textbox';

interface CreateProjectModalProps {
  open: boolean;
  close: () => void;
  refetchData: () => void;
}

interface Skill {
  id: number;
  skillName: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, close, refetchData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
  });
  const [showNewSkillOption, setShowNewSkillOption] = useState<boolean>(false);

  const filteredSkills = query === ''
    ? []
    : skills.filter(skill =>
      skill.skillName.includes(query)
    );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateInputs = () => {
    if (!form.title) return 'Project name is required';
    if (!form.description) return 'Project description is required';
    if (selectedSkills.length === 0) return 'Please select at least one skill';
    return '';
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
    });
    setSelectedSkills([]);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const data = {
      title: form.title,
      description: form.description,
      skills: selectedSkills.map(skill => skill.id),
    }

    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.post('/projects/add', data);
      if (response.status === 200) {
        close(); // Close modal on successful creation
        refetchData(); // Refetch data to update the UI
        resetForm(); // Reset the form
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
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
      }
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
            <form onSubmit={handleSubmit}>
              <DialogTitle className='mb-5'>
                <p className='font-bold text-2xl'>Create a project!</p>
              </DialogTitle>
              <p className="my-2 font-bold">Project Name (Required)</p>
              <Textbox
                placeholder={'Enter your Project Name...'}
                id='title'
                name='title'
                value={form.title}
                onChange={handleInputChange}
                disabled={loading}
              />
              <p className="my-2 font-bold">Project Description (Required)</p>
              <Textarea
                placeholder={'Enter the description of your project...'}
                id='description'
                name='description'
                className='block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6'
                value={form.description}
                onChange={handleInputChange}
                autoComplete={'off'}
                disabled={loading}
              />
              <p className="my-2 font-bold">Skills Needed</p>
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
                    {(showNewSkillOption && query !== '') && (
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


              <div className='mt-5 flex justify-center'>
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <ButtonSubmit text='Create Project' />
                )}
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog >
  )
}

export default CreateProjectModal;
