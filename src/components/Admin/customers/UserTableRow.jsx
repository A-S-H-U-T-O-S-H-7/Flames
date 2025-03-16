import { useState } from 'react';
import UserEditModal from './UserEditModal';

const UserTableRow = ({ user, index, formatDateTime }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-colors duration-200">
        <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
          {index}
        </td>
        <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
          {formatDateTime(user?.timestampCreate)}
        </td>
        <td className="px-4 py-3">
          <div className="flex justify-center">
            <img 
              src={user?.photoURL || '/default-avatar.png'} 
              className="h-10 w-10 rounded-lg object-cover shadow-sm"
              alt={user?.displayName || 'User avatar'}
            />
          </div>
        </td>
        <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
          {user?.displayName || 'Unnamed User'}
        </td>
        <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
          {user?.email || 'No Email'}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-sm py-1 px-3 bg-[#22c7d5]/10 text-[#22c7d5] rounded-md hover:bg-[#22c7d5]/20 transition-colors duration-200"
          >
            Edit
          </button>
        </td>
      </tr>
      {isEditModalOpen && (
        <UserEditModal 
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            // You can add additional logic here after successful update
            // For example, refreshing the data
          }}
        />
      )}
    </>
  );
};

export default UserTableRow;