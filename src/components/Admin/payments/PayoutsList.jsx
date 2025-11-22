'use client';
import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Pagination,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  DatePicker,
} from '@nextui-org/react';
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Calendar,
} from 'lucide-react';

export default function PayoutsList({ 
  payouts = [], 
  loading = false,
  onStatusUpdate,
  onGeneratePayouts,
  onExportData,
  pagination,
  onPageChange 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();

  const statusColors = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    failed: 'danger',
    cancelled: 'default',
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.sellerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.sellerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    onOpen();
  };

  const handleStatusUpdate = async (payoutId, newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(payoutId, newStatus);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">Payouts</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                startContent={<RefreshCw className="w-4 h-4" />}
                isLoading={loading}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="bordered"
                startContent={<Plus className="w-4 h-4" />}
                onPress={onGenerateOpen}
              >
                Generate Payouts
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="bordered"
                startContent={<Download className="w-4 h-4" />}
                onPress={onExportData}
              >
                Export
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 w-full">
            <Input
              placeholder="Search by seller name, email, or ID..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <SelectItem key="all" value="all">All Status</SelectItem>
              <SelectItem key="pending" value="pending">Pending</SelectItem>
              <SelectItem key="processing" value="processing">Processing</SelectItem>
              <SelectItem key="completed" value="completed">Completed</SelectItem>
              <SelectItem key="failed" value="failed">Failed</SelectItem>
              <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
            </Select>
          </div>
        </CardHeader>

        <CardBody>
          <Table aria-label="Payouts table">
            <TableHeader>
              <TableColumn>PAYOUT ID</TableColumn>
              <TableColumn>SELLER</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>FEES</TableColumn>
              <TableColumn>NET AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody 
              emptyContent={loading ? "Loading..." : "No payouts found"}
              isLoading={loading}
            >
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {payout.id?.slice(-8) || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payout.sellerName || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{payout.sellerEmail || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {formatCurrency(payout.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatCurrency(payout.fees)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(payout.netAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={statusColors[payout.status] || 'default'}
                      variant="flat"
                    >
                      {payout.status?.toUpperCase() || 'UNKNOWN'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(payout.periodStart)}</p>
                      <p className="text-gray-500">to {formatDate(payout.periodEnd)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(payout.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="View Details">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          onPress={() => handleViewDetails(payout)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={pagination.totalPages}
                page={pagination.currentPage}
                onChange={onPageChange}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Payout Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payout Details
              </ModalHeader>
              <ModalBody>
                {selectedPayout && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Payout Information
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">ID:</span> {selectedPayout.id}</p>
                          <p><span className="font-medium">Status:</span> 
                            <Chip 
                              size="sm" 
                              color={statusColors[selectedPayout.status]} 
                              variant="flat"
                              className="ml-2"
                            >
                              {selectedPayout.status?.toUpperCase()}
                            </Chip>
                          </p>
                          <p><span className="font-medium">Created:</span> {formatDate(selectedPayout.createdAt)}</p>
                          <p><span className="font-medium">Updated:</span> {formatDate(selectedPayout.updatedAt)}</p>
                          <p><span className="font-medium">Processed:</span> {formatDate(selectedPayout.processedAt)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Amount Breakdown
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Total Amount:</span> {formatCurrency(selectedPayout.amount)}</p>
                          <p><span className="font-medium">Processing Fees:</span> {formatCurrency(selectedPayout.fees)}</p>
                          <p><span className="font-medium">Net Amount:</span> 
                            <span className="font-bold text-green-600 ml-1">
                              {formatCurrency(selectedPayout.netAmount)}
                            </span>
                          </p>
                          <p><span className="font-medium">Transactions:</span> {selectedPayout.transactionCount || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Seller Information
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedPayout.sellerName}</p>
                          <p><span className="font-medium">Email:</span> {selectedPayout.sellerEmail}</p>
                          <p><span className="font-medium">ID:</span> {selectedPayout.sellerId}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Payout Period
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Start Date:</span> {formatDate(selectedPayout.periodStart)}</p>
                          <p><span className="font-medium">End Date:</span> {formatDate(selectedPayout.periodEnd)}</p>
                          <p><span className="font-medium">Payment Method:</span> {selectedPayout.paymentMethod || 'N/A'}</p>
                          <p><span className="font-medium">Reference:</span> {selectedPayout.paymentReference || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {selectedPayout.notes && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Notes</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">
                          {selectedPayout.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedPayout?.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      color="primary"
                      onPress={() => handleStatusUpdate(selectedPayout.id, 'processing')}
                    >
                      Start Processing
                    </Button>
                    <Button 
                      color="success"
                      onPress={() => handleStatusUpdate(selectedPayout.id, 'completed')}
                    >
                      Mark Completed
                    </Button>
                  </div>
                )}
                {selectedPayout?.status === 'processing' && (
                  <Button 
                    color="success"
                    onPress={() => handleStatusUpdate(selectedPayout.id, 'completed')}
                  >
                    Mark Completed
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Generate Payouts Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Generate Seller Payouts
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Generate payouts for all eligible sellers for the specified period.
                    Only completed transactions will be included.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      placeholder="Select start date"
                    />
                    <DatePicker
                      label="End Date"
                      placeholder="Select end date"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                      Important Notes:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Only completed transactions will be included</li>
                      <li>Sellers must have valid payout information</li>
                      <li>Processing fees will be automatically deducted</li>
                      <li>Payouts will be created with "pending" status</li>
                    </ul>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary"
                  onPress={() => {
                    if (onGeneratePayouts) {
                      onGeneratePayouts();
                    }
                    onClose();
                  }}
                >
                  Generate Payouts
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}