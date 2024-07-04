import {
  TrashIcon
} from '@heroicons/react/24/outline';
import { axiosInstanceWithAuth } from '../api/Axios';
import { useState } from 'react';
import LoadingCircle from './LoadingCircle';
import { useModal } from '../contexts/DeleteModalContext';

interface UserDetailsProps {
  zid: string;
  fullname: string;
  userType: string;
  createdAt: string;
  refetchData: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({zid, fullname, userType, createdAt, refetchData}) => {
  const userSince = new Date(createdAt);
  const [loading, setLoading] = useState(false);
  const deleteUser = async () => {
    setLoading(true);
    await axiosInstanceWithAuth.delete(`/user/remove/${zid}`);
    setLoading(false);
    refetchData();
  }

  const { openCloseModal } = useModal();

  return (
    <div className="p-4 mt-3 rounded-md bg-slate-100 shadow-md flex justify-between gap-2">
      <p className="w-1/12">{zid}</p>
      <p className="w-1/5 overflow-hidden">{fullname}</p>
      <p className="w-1/12 mr-2 font-bold">{userType}</p>
      <p className="w-1/5 overflow-hidden">{`User since: ${userSince.toLocaleDateString()}`}</p>
      {loading ? ( 
        <LoadingCircle/> 
      ) : (
        <div title='Delete User' onClick={openCloseModal}>
          <TrashIcon className='h-[24px] hover:text-red-500 hover:scale-105 cursor-pointer'/>
        </div>
      )}
    </div>
  )
}

export default UserDetails