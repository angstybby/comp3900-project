import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import { useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import { PlusCircle } from 'lucide-react';
import ButtonLoading from '../Buttons/ButtonLoading';

interface AcceptGroupConfirmationProps {
  open: boolean;
  close: () => void;
  group: {
    id: number;
    groupName: string;
  };
  projectId: string | undefined;
  refetchData: () => void;
}

const AcceptGroupConfirmationModal: React.FC<AcceptGroupConfirmationProps> = ({ open, close, group, projectId, refetchData }) => {
  const [loading, setLoading] = useState(false);

  const confirmAcceptGroup = async () => {
    try {
      setLoading(true);
      const body = {
        projectId: projectId,
        groupId: group.id
      }
      await axiosInstanceWithAuth.post('/projects/accept', body);
      refetchData();
      setLoading(false);
      close();
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onClose={close} className="relative z-[100]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircle aria-hidden="true" className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Accept Group Confirmation
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to accept group <span className="font-semibold">{group.groupName}</span> to the project?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {loading ? (<ButtonLoading />) : (<button
                  type="button"
                  onClick={confirmAcceptGroup}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                  Accept
                </button>)}
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AcceptGroupConfirmationModal