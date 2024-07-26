import { axiosInstanceWithAuth } from '@/api/Axios';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ViewMembersModalProps {
  open: boolean;
  close: () => void;
}

interface Member {
  zid: string,
}

const ViewMembersModal: React.FC<ViewMembersModalProps> = ({ open, close }) => {
 
  const [members, setMembers] = useState<Member[]>([]);
  const { groupId } = useParams<{ groupId: string }>();
  
  const fetchMemberDetails = useCallback(async () => {
    try {
      const response = await axiosInstanceWithAuth.get(`/group/members/${groupId}`)
      setMembers(response.data);
    } catch (error) {
      console.error("Error getting group members:", error);
    }

  }, [groupId]);

  useEffect(() => {
    fetchMemberDetails();
  }, [fetchMemberDetails]);

  
  return (
    <Dialog open={open} onClose={() => close()} className="relative z-10">
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
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Your Group Members
                  </DialogTitle>
                  {members.map((member) => (
                    <div>
                    
                      <h2 className="text-xl font-semibold text-center mt-2">{member.zid}</h2>
  
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ViewMembersModal;
