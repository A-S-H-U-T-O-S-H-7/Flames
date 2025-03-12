// UserTable.jsx
import { CircularProgress } from "@nextui-org/react";
import UserTableRow from "./UserTableRow";

const UserTable = ({ 
  users, 
  isLoading, 
  searchQuery, 
  
  pageOffset = 0
}) => {
  // Format date and time from Firestore timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "N/A";
    }
    
    // Convert Firestore timestamp to JavaScript Date
    const date = new Date(timestamp.seconds * 1000);
    
    // Format date in DD/MM/YY format
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    // Format time in h:MMam/pm format
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1e2737]">
              <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-l-lg">
                SN
              </th>
              <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                Created At
              </th>
              <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                Photo
              </th>
              <th className="font-semibold px-4 py-3 text-left text-gray-600 dark:text-gray-300">
                Name
              </th>
              <th className="font-semibold px-4 py-3 text-left text-gray-600 dark:text-gray-300">
                Email
              </th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">
                  <CircularProgress size="sm" className="text-[#22c7d5]" />
                </td>
              </tr>
            ) : users?.length > 0 ? (
              users.map((user, index) => (
                <UserTableRow
                  key={user?.id || index}
                  user={user}
                  index={index + pageOffset + 1}
                  formatDateTime={formatDateTime}
                                  />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ?
                    "No users match your search criteria" :
                    "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;