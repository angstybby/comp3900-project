import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea
} from '@headlessui/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '../Buttons/ButtonLoading';
import ButtonSubmit from '../Buttons/ButtonSubmit';
import Textbox from '../Inputs/Textbox';
import TextboxNotReq from '../Inputs/TextboxNotRequired';

interface CreateGroupModalProps {
  open: boolean;
  close: () => void;
  refetchData: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, close, refetchData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form, setForm] = useState({
    groupName: '',
    groupDescription: '',
    zids: '',
    maxMembers: 5,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateInputs = () => {
    if (!form.groupName) return 'Group name is required';
    if (form.maxMembers < 1 || form.maxMembers > 10) return 'Max members should be between 1 and 10';
    return '';
  };

  const resetForm = () => {
    setForm({
      groupName: '',
      groupDescription: '',
      zids: '',
      maxMembers: 5,
    });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    let zIdArray: string | any[] = [];

    if (form.zids !== '') {
      zIdArray = form.zids.split(',').map((zid) => zid.trim());
    }

    if (zIdArray.length > form.maxMembers - 1) {
      setErrorMessage('Number of zIDs exceeds max members');
      return;
    }

    console.log(zIdArray);

    const data = {
      groupName: form.groupName,
      description: form.groupDescription,
      zIds: zIdArray,
      maxMembers: form.maxMembers,
    }


    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.post('/group/create', data);
      if (response.status === 200) {
        close(); // Close modal on successful creation
        refetchData(); // Refetch data to update the UI
        resetForm(); // Reset the form
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        setErrorMessage(error.response.data);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
                <p className='font-bold text-2xl'>Create your Group!</p>
                <p className='font-thin text-sm opacity-90 mt-1'>Each student can only create one group.</p>
              </DialogTitle>
              <p className="my-2 font-bold">Group Name (Required)</p>
              <Textbox
                placeholder={'Enter your group name...'}
                id='groupName'
                name='groupName'
                value={form.groupName}
                onChange={handleInputChange}
                disabled={loading}
              />
              <p className="my-2 font-bold">Description (Required)</p>
              <Textarea
                placeholder={'Enter the description of your group...'}
                id='groupDescription'
                name='groupDescription'
                className='resize-none block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6'
                value={form.groupDescription}
                onChange={handleInputChange}
                autoComplete={'off'}
                disabled={loading}
              />
              <p className="my-2 font-bold">Invite Users</p>
              <TextboxNotReq
                placeholder={'Enter zIDs separated by a comma...'}
                id='zids'
                name='zids'
                value={form.zids}
                onChange={handleInputChange}
                autoComplete={'off'}
                disabled={loading}
              />
              <p className="my-2 text-xs">Similar Users:</p>
              <p className="my-2 font-bold">Max Users (Required)</p>
              <Textbox
                id='maxMembers'
                name='maxMembers'
                type='number'
                value={form.maxMembers}
                onChange={handleInputChange}
                max={10}
                min={1}
                disabled={loading}
              />
              {errorMessage && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}


              <div className='mt-5 flex justify-center'>
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <ButtonSubmit text='Create Group' />
                )}
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CreateGroupModal;
