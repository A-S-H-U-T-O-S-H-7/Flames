"use client";

import { useUsers } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Edit, Search, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const { data: users, error, isLoading, lastSnapDoc } = useUsers({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

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

  // Apply search filter whenever users or search query changes
  useEffect(() => {
    if (!users) return;
    
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.id?.toLowerCase().includes(searchQuery.toLowerCase()) // Added user ID search
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setImagePreview(user.photoURL || null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would implement your update logic
      // For example: await updateUser(editUser.id, editUser);
      // You'll need to create this function later
      console.log("Updating user:", editUser);
      
      // Close the modal after successful update
      setIsEditModalOpen(false);
      setEditUser(null);
      setImagePreview(null);
      
      // You might want to refresh the users list here
      // or handle optimistic UI updates
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error appropriately
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoURLChange = (e) => {
    const value = e.target.value;
    setEditUser(prev => ({
      ...prev,
      photoURL: value
    }));
    setImagePreview(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This would be where you'd upload to storage and get URL
        // For now, we'll just update the preview
        setImagePreview(reader.result);
        setEditUser(prev => ({
          ...prev,
          photoURL: reader.result // In real app, this would be the uploaded file URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (isLoading && lastSnapDocList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-[#0e1726] rounded-xl p-4 border no-scrollbar border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200">
      {/* Header with title and search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Customers
          <span className="ml-2 px-2 py-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredUsers?.length ?? 0} users
          </span>
        </h1>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      
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
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-r-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading && lastSnapDocList.length > 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <CircularProgress size="sm" className="text-[#22c7d5]" />
                  </td>
                </tr>
              ) : filteredUsers?.length > 0 ? (
                filteredUsers.map((item, index) => (
                  <Row
                    key={item?.id || index}
                    item={item}
                    index={index + lastSnapDocList?.length * pageLimit}
                    formatDateTime={formatDateTime}
                    onEditClick={handleEditClick}
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrePage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
        >
          <option value={3}>3 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <Button
          isDisabled={isLoading || users?.length === 0}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>

      {/* Enhanced Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditUser(null);
          setImagePreview(null);
        }}
        size="md"
        classNames={{
          base: "bg-white dark:bg-[#1e2737] shadow-xl rounded-xl",
          header: "border-b border-gray-200 dark:border-gray-700 pb-2",
          body: "py-4",
          footer: "border-t border-gray-200 dark:border-gray-700 pt-2"
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-800 dark:text-white">
                Edit User Profile
              </ModalHeader>
              <ModalBody>
                {editUser && (
                  <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <Avatar
                          src={imagePreview || '/default-avatar.png'}
                          className="h-24 w-24 rounded-full shadow-md border-2 border-[#22c7d5]"
                          alt={editUser.displayName || 'User avatar'}
                        />
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                          onClick={triggerFileInput}
                        >
                          <Upload size={24} className="text-white" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="flat" 
                        color="primary"
                        onClick={triggerFileInput}
                        className="text-sm bg-[#22c7d5]/10 text-[#22c7d5] hover:bg-[#22c7d5]/20 transition-colors"
                      >
                        Change Photo
                      </Button>
                    </div>
                    
                    {/* Photo URL Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Profile Photo URL
                      </label>
                      <input
                        type="text"
                        name="photoURL"
                        value={editUser.photoURL || ''}
                        onChange={handlePhotoURLChange}
                        placeholder="https://example.com/photo.jpg"
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] focus:ring-1 focus:ring-[#22c7d5] transition-all"
                      />
                    </div>
                    
                    {/* Display Name Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={editUser.displayName || ''}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] focus:ring-1 focus:ring-[#22c7d5] transition-all"
                      />
                    </div>
                    
                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editUser.email || ''}
                        onChange={handleInputChange}
                        placeholder="user@example.com"
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] focus:ring-1 focus:ring-[#22c7d5] transition-all"
                      />
                    </div>

                    {/* User ID (Read Only) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        User ID
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={editUser.id || ''}
                        readOnly
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a101c] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </form>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  variant="light" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditUser(null);
                    setImagePreview(null);
                  }}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onClick={handleEditSubmit}
                  className="bg-[#22c7d5] text-white hover:bg-[#1ea8b5] transition-colors"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function Row({ item, index, formatDateTime, onEditClick }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-colors">
      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
        {formatDateTime(item?.timestampCreate)}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <Avatar 
            src={item?.photoURL} 
            className="h-10 w-10 rounded-lg shadow-sm"
            alt={item?.displayName || 'User avatar'}
          />
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
        {item?.displayName || 'Unnamed User'}
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
        {item?.email || 'No Email'}
      </td>
      <td className="px-4 py-3 text-center">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => onEditClick(item)}
          className="text-gray-500 hover:text-[#22c7d5] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <Edit size={16} />
        </Button>
      </td>
    </tr>
  );
}