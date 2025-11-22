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
} from '@nextui-org/react';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function TransactionsList({ 
  transactions = [], 
  loading = false,
  onStatusUpdate,
  onExportData,
  pagination,
  onPageChange 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const statusColors = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'secondary',
    cancelled: 'default',
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    onOpen();
  };

  const handleStatusUpdate = async (transactionId, newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(transactionId, newStatus);
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
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold">Transactions</h3>
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
            placeholder="Search by order ID, seller, or buyer..."
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
            <SelectItem key="completed" value="completed">Completed</SelectItem>
            <SelectItem key="pending" value="pending">Pending</SelectItem>
            <SelectItem key="failed" value="failed">Failed</SelectItem>
            <SelectItem key="refunded" value="refunded">Refunded</SelectItem>
            <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
          </Select>
        </div>
      </CardHeader>

      <CardBody>
        <Table aria-label="Transactions table">
          <TableHeader>
            <TableColumn>ORDER ID</TableColumn>
            <TableColumn>SELLER</TableColumn>
            <TableColumn>BUYER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>FEES</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={loading ? "Loading..." : "No transactions found"}
            isLoading={loading}
          >
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <span className="font-mono text-sm">
                    {transaction.orderId?.slice(-8) || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.sellerName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{transaction.sellerId?.slice(-8) || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.buyerName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{transaction.buyerEmail || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    <p className="text-sm text-gray-500">
                      Net: {formatCurrency(transaction.sellerAmount)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{formatCurrency(transaction.platformFee)}</p>
                    <p className="text-xs text-gray-500">
                      ({((transaction.platformFee / transaction.amount) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={statusColors[transaction.status] || 'default'}
                    variant="flat"
                  >
                    {transaction.status?.toUpperCase() || 'UNKNOWN'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {formatDate(transaction.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="View Details">
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={() => handleViewDetails(transaction)}
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

      {/* Transaction Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Transaction Details
              </ModalHeader>
              <ModalBody>
                {selectedTransaction && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Transaction Info
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">ID:</span> {selectedTransaction.id}</p>
                          <p><span className="font-medium">Order ID:</span> {selectedTransaction.orderId}</p>
                          <p><span className="font-medium">Status:</span> 
                            <Chip 
                              size="sm" 
                              color={statusColors[selectedTransaction.status]} 
                              variant="flat"
                              className="ml-2"
                            >
                              {selectedTransaction.status?.toUpperCase()}
                            </Chip>
                          </p>
                          <p><span className="font-medium">Created:</span> {formatDate(selectedTransaction.createdAt)}</p>
                          <p><span className="font-medium">Updated:</span> {formatDate(selectedTransaction.updatedAt)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Payment Details
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Amount:</span> {formatCurrency(selectedTransaction.amount)}</p>
                          <p><span className="font-medium">Platform Fee:</span> {formatCurrency(selectedTransaction.platformFee)}</p>
                          <p><span className="font-medium">Seller Amount:</span> {formatCurrency(selectedTransaction.sellerAmount)}</p>
                          <p><span className="font-medium">Payment Method:</span> {selectedTransaction.paymentMethod || 'N/A'}</p>
                          <p><span className="font-medium">Transaction ID:</span> {selectedTransaction.paymentTransactionId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Seller Info
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedTransaction.sellerName}</p>
                          <p><span className="font-medium">ID:</span> {selectedTransaction.sellerId}</p>
                          <p><span className="font-medium">Email:</span> {selectedTransaction.sellerEmail || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">
                          Buyer Info
                        </h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedTransaction.buyerName}</p>
                          <p><span className="font-medium">Email:</span> {selectedTransaction.buyerEmail}</p>
                          <p><span className="font-medium">ID:</span> {selectedTransaction.buyerId}</p>
                        </div>
                      </div>
                    </div>

                    {selectedTransaction.notes && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Notes</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">
                          {selectedTransaction.notes}
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
                {selectedTransaction?.status === 'pending' && (
                  <Button 
                    color="primary"
                    onPress={() => handleStatusUpdate(selectedTransaction.id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}