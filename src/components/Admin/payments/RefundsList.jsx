'use client';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from '@nextui-org/react';
import {
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function RefundsList({ 
  refunds = [], 
  loading = false,
  onRefresh 
}) {
  return (
    <Card className="bg-[#0e1726] border-gray-700">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Refund Requests</h3>
          <p className="text-gray-400 text-sm">Process and track refund requests from customers</p>
        </div>
        <Button
          size="sm"
          variant="bordered"
          startContent={<RefreshCw className="w-4 h-4" />}
          onPress={onRefresh}
          isLoading={loading}
          className="text-white border-gray-600"
        >
          Refresh
        </Button>
      </CardHeader>
      
      <CardBody>
        <div className="text-center py-12">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Refund Management Coming Soon
          </h3>
          <p className="text-gray-400 mb-6">
            This feature will allow you to process refund requests from customers,
            track refund status, and manage dispute resolutions.
          </p>
          
          <div className="bg-[#1e2737] rounded-lg p-6 max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-white mb-3">Planned Features:</h4>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• Automated refund request processing</li>
              <li>• Integration with payment gateways</li>
              <li>• Partial and full refund support</li>
              <li>• Refund approval workflow</li>
              <li>• Customer notification system</li>
              <li>• Refund analytics and reporting</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}