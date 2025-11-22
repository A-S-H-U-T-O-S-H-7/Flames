"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSeller } from '@/lib/firestore/sellers/read';
import { subscribeToNotifications } from '@/lib/firestore/notifications/read';
import NotificationHeader from './NotificationHeader';
import NotificationFilters from './NotificationFilters';
import NotificationTable from './NotificationTable';
import EmptyState from './EmptyState';
import Pagination from '../Pangination';

export default function SellerNotifications() {
  const { user } = useAuth();
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email });
  const sellerId = seller?.id;
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });

  // Real-time notifications listener
  useEffect(() => {
    if (!sellerId || sellerLoading) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = subscribeToNotifications(sellerId, (notifs) => {
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sellerId, sellerLoading]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = searchTerm === '' ||
      notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notif.productName && notif.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.customerName && notif.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filters.status !== 'all' && notif.status !== filters.status) return false;
    if (filters.type !== 'all' && notif.type !== filters.type) return false;
    
    return matchesSearch;
  });

  // Pagination
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      type: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Loading state
  if (sellerLoading || !sellerId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationHeader 
        notifications={notifications}
        filteredCount={filteredNotifications.length}
        sellerId={sellerId}
      />
      
      <NotificationFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
      />
      
      {filteredNotifications.length === 0 ? (
        <EmptyState filters={filters} />
      ) : (
        <div className="space-y-3">
          <NotificationTable 
            notifications={currentNotifications}
          />
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                showItemsCount={true}
                itemLabel="notifications"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}