import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/react';
import { useState, useEffect, FormEvent } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import ButtonLoading from '../Buttons/ButtonLoading';
import ButtonSubmit from '../Buttons/ButtonSubmit';

interface InviteUserModalProps {
  open: boolean;
  close: () => void;
  refetchData: () => void;
  groupId: number;
}

interface User {
  zid: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ open, close, refetchData, groupId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const response = await axiosInstanceWithAuth.get(`/group/not-in-group/${groupId}`);
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchUsers();
    }
  }, [open, groupId]);

  const filteredUsers = query === ''
    ? users
    : users.filter(user =>
      user.zid.includes(query)
    );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Call your API to invite users
      users.forEach(async user => {
        if (selectedUsers.includes(user)) {
          await axiosInstanceWithAuth.post(`/group/invite`, {
            groupId,
            zId: user.zid,
          });
        }
      });
      refetchData();
      close();
    } catch (error: any) {
      console.error('Error inviting users:', error);
      setError(error.response.data.message);
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
              <DialogTitle className='mb-5 text-2xl font-semibold'>
                Invite Users
              </DialogTitle>

              {/* Make a combobox of users who are not in the group */}
              <Combobox multiple value={selectedUsers} onChange={setSelectedUsers} onClose={() => setQuery('')}>
                {
                  selectedUsers.length > 0 && (
                    <div className='mb-5'>
                      <p className='text-lg text-black'>
                        Selected users:
                      </p>
                      <ul>
                        {selectedUsers.map(user => (
                          <li key={user.zid}>
                            {user.zid}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                }
                <ComboboxInput
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(user: User) => user.zid}
                  className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                  placeholder="Search for users and select all that you want to invite..."
                />
                <ComboboxOptions
                  transition
                  className='w-[var(--input-width)] rounded-xl border border-gray-800/5 bg-gray-800/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                >
                  {filteredUsers.map(user => (
                    <ComboboxOption
                      key={user.zid}
                      value={user}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-indigo-500/30">
                      {user.zid}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </Combobox>

              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
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

export default InviteUserModal;
