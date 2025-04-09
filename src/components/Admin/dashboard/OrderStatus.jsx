import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '@/components/Admin/dashboard/StatsCard';

const OrderStatusStats = ({ deliveredOrders, cancelledOrders }) => {
  return (
    <>
      <StatsCard 
        title="Delivered Orders" 
        value={deliveredOrders} 
        icon={<CheckCircle size={20} />} 
        color="#00C853"
      />
      
      <StatsCard 
        title="Cancelled Orders" 
        value={cancelledOrders} 
        icon={<XCircle size={20} />} 
        color="#FF5252"
      />
    </>
  );
};

export default OrderStatusStats;