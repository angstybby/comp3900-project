import { axiosInstanceWithAuth } from "@/api/Axios";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

interface FeedbackModalProps {
  open: boolean;
  close: () => void;
  member: Member | null;
  groupId: string;
}

interface Member {
  zid: string;
  fullname: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, close, member, groupId }) => {
  const [comment, setComment] = useState<string>('');

  // const handleFeedbackSubmit = async => {
  //   if (!member|| !comment) return;

  //   try {
  //     // await axiosInstanceWithAuth.post()
  //   } catch (error) {
  //     console.error('Error submitting feedback.', error);
  //   }
  //   
  // }

  return (
    <Dialog open={open} onClose={close} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <DialogTitle as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                  Give Feedback to {member?.fullname}
                </DialogTitle>
                <div className="mt-2 border-b border-gray-200"></div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default FeedbackModal;