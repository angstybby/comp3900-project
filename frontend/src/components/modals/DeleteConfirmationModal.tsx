import { 
  Dialog, 
  DialogBackdrop, 
  DialogPanel 
} from '@headlessui/react'

const DeleteConfirmationModal = ({ open, close }: {open:boolean, close: () => void}) => {
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
              
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteConfirmationModal