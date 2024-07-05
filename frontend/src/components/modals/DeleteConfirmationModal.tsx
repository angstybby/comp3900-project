import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import ButtonWarning from "@/components/Buttons/ButtonWarning";
import { useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import LoadingCircle from '@/components/LoadingCircle';

interface DeleteModalProps {
  open: boolean;
  close: () => void;
  zid?: string;
  refetchData: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ open, close, zid, refetchData }) => {
  const [loading, setLoading] = useState(false);

  const confirmDeleteUser = async () => {
    try {
      setLoading(true);
      await axiosInstanceWithAuth.delete(`/user/remove/${zid}`);
      refetchData();
      setLoading(false);
      close();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative z-[100] focus:outline-none transition duration-150 ease-out"
        transition
        onClose={close}
      >
        <DialogBackdrop
          className="fixed inset-0 bg-black/30 data-[closed]:opacity-0 duration-150 ease-out"
          transition
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <DialogPanel
              transition
              className="w-full max-w-2xl rounded-xl bg-white/60 p-6 px-8 backdrop-blur-2xl duration-150 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle className='mb-3'>
                <span>Are you sure you want to delete this user</span>
                <span className='font-bold'>{` (${zid}) `}</span>
                <span>?</span>
              </DialogTitle>
              <div onClick={confirmDeleteUser}>
                {loading ? (
                  <div className='w-full flex justify-center'>
                    <LoadingCircle />
                  </div>
                ) : (
                  <ButtonWarning text={'Yes'} />
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteConfirmationModal