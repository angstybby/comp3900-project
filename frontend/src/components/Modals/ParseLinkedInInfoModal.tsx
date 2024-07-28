import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import ButtonWarning from "@/components/Buttons/ButtonWarning";
import { useState } from 'react';
import LoadingCircle from '@/components/LoadingCircle';
import ButtonUtility from '../Buttons/ButtonUtility';

interface Props {
  open: boolean;
  close: () => void;
  sync: () => void;
}

const ParseLinkedInInfoModal: React.FC<Props> = ({ open, close, sync }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    sync();
    close();
    setLoading(false);
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
                <p className='text-xl font-bold'>Would you like to parse in your LinkedIn details?</p>
              </DialogTitle>
              {loading ? (
                <div className='w-full flex justify-center'>
                  <LoadingCircle />
                </div>
              ) : (
                <div className='flex gap-2'>
                  <ButtonUtility text={'Yes'} onClick={handleClick} />
                  <ButtonWarning text={'No'} onClick={close}/>
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ParseLinkedInInfoModal