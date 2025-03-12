// UserTableRow.jsx


const UserTableRow = ({ user, index, formatDateTime }) => {
  return (
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
      
    </tr>
  );
};

export default UserTableRow;