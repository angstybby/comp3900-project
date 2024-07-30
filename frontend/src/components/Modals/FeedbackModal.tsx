import { axiosInstanceWithAuth } from "@/api/Axios";
import { useProfile } from "@/contexts/ProfileContext";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

interface FeedbackModalProps {
  open: boolean;
  close: () => void;
  member: Member | null;
}

interface Member {
  zid: string;
  fullname: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, close, member }) => {
  const { profileData, fetchProfileData } = useProfile();
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  
  useEffect(() => {
    fetchProfileData();
  }, []);


  
  const handleSubmitFeedback = async () => {
    if (!member|| !comment || !rating) return;
    const data = {
      fromZid: profileData.zid,
      toZid: member.zid,
      comment,
      rating,
    }

    console.log(data)
    try {
      const response = await axiosInstanceWithAuth.post('/group/feedback', data)
      if (response.status === 200) {
        close(); // Close modal on successful creation
        // refetchData(); // Refetch data to update the UI
        // resetForm(); // Reset the form
      }
    } catch (error) {
      console.error('Error submitting feedback.', error);
    }
    
  }

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
                <div className="mt-4">
                    <textarea
                      className="w-full border rounded p-2"
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your feedback here..."
                    ></textarea>
                    <div className="mt-4">
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5):</label>
                      <input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        className="w-full border rounded p-2 mt-1"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        placeholder="Enter rating between 1 and 5"
                      />
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitFeedback}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default FeedbackModal;