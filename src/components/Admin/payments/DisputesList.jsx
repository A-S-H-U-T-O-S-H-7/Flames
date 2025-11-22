'use client';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from '@nextui-org/react';
import {
  RefreshCw,
  Shield,
  AlertCircle,
} from 'lucide-react';

export default function DisputesList({ 
  disputes = [], 
  loading = false,
  onRefresh 
}) {
  return (
    <Card className="bg-[#0e1726] border-gray-700">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Payment Disputes</h3>
          <p className="text-gray-400 text-sm">Manage chargebacks, disputes, and fraud prevention</p>
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
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Dispute Management Coming Soon
          </h3>
          <p className="text-gray-400 mb-6">
            This feature will help you manage payment disputes, chargebacks,
            and fraud prevention measures to protect your marketplace.
          </p>
          
          <div className="bg-[#1e2737] rounded-lg p-6 max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-white mb-3">Planned Features:</h4>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• Chargeback management and responses</li>
              <li>• Dispute evidence collection</li>
              <li>• Fraud detection and prevention</li>
              <li>• Seller protection programs</li>
              <li>• Automated dispute resolution</li>
              <li>• Risk assessment and scoring</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">Important Note</span>
            </div>
            <p className="text-xs text-yellow-200">
              Dispute management requires integration with payment processors and 
              regulatory compliance measures. This feature will be implemented with 
              proper security and legal considerations.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}