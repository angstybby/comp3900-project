import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import { useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import { Details, Project } from '@/utils/interfaces';
import { PlusCircle } from 'lucide-react';
import ButtonLoading from '../Buttons/ButtonLoading';

interface ApplyProjectConfirmationProps {
  open: boolean;
  close: () => void;
  group: Details;
  project: Project;
  refetchData: () => void;
}

const ApplyProjectConfirmationModal: React.FC<ApplyProjectConfirmationProps> = ({ open, close, group, project, refetchData }) => {
  const [loading, setLoading] = useState(false);

  const confirmApplyProject = async () => {
    try {
      setLoading(true);
      const body = {
        groupId: group.id,
        projectId: project.id
      }
      await axiosInstanceWithAuth.post('/group/apply-project', body);
      refetchData();
      setLoading(false);
      close();
    } catch (error) {
      console.log(error)
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
                      Apply for Project {project.title}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to apply for the project <span className='font-bold'>{project.title}</span> in the group <span className='font-bold'>{group.groupName}</span>. Are you sure you want to proceed?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {loading ? (<ButtonLoading />) : (<button
                  type="button"
                  onClick={confirmApplyProject}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                  Apply
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

export default ApplyProjectConfirmationModal