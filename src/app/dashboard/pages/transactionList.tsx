

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../../redux/slices/transactionSlice/transactionsSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import { showErrorAlert } from "../../../utils/swal";

export default function TransactionList({ onNavigate }: { onNavigate: (page: string, data?: unknown) => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, pagination, isLoading, error } = useSelector((state: RootState) => state.transactions);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    console.log('TransactionList - Fetching with:', { page, limit, sortBy, sortOrder });
    dispatch(fetchTransactions({ page, limit, sortBy, sortOrder }));
  }, [dispatch, page, sortBy, sortOrder, limit]);

  useEffect(() => {
    if (error) {
      console.error('Transaction Error from Redux:', error);
      showErrorAlert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    console.log('Transactions State:', { transactions, pagination, isLoading, error });
  }, [transactions, pagination, isLoading, error]);

  const columns = [
    { label: "Order ID", accessor: "razorpayOrderId" },
    { label: "Story Name", accessor: "storyName" },
    { label: "Traveller Name", accessor: "TravellerName" },
    { 
      label: "Amount", 
      accessor: "amount",
      render: (value: unknown) => {
        const amount = value as number;
        return amount ? `₹${amount.toFixed(2)}` : '₹0.00';
      }
    },
    { label: "Payment Method", accessor: "paymentMethod" },
    { 
      label: "Date of Payment", 
      accessor: "DateOfPayment",
      render: (value: unknown) => {
        const date = value as string;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      }
    },
  ];

  return (
    <div className="px-4 py-8">
     <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Transaction Views and Details</h1>
      <div className="text-right">
       <p className="text-sm text-gray-600">Total Transactions</p>
       <p className="text-2xl font-bold text-[#FF2B36]">{pagination?.total || 0}</p>
      </div>
     </div>
     <div className="w-full flex justify-end items-center gap-4 mt-10">
      <div className="flex gap-4">
        <Dropdown
          options={[
            { label: "Date (Desc)", value: "date-desc" },
            { label: "Date (Asc)", value: "date-asc" },
            { label: "Amount (Desc)", value: "amount-desc" },
            { label: "Amount (Asc)", value: "amount-asc" },
          ]}
          placeholder="Sort by"
          value={`${sortBy}-${sortOrder}`}
          onChange={(value) => {
            const [by, order] = value.split('-');
            setSortBy(by);
            setSortOrder(order);
            setPage(1);
          }}
          width="w-40"
        />
      </div>
     </div>
     <div className="mt-8">
       {isLoading ? (
         <div className="flex justify-center items-center h-32">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2B36]"></div>
         </div>
       ) : (
         <ReusableTable
           columns={columns}
           data={transactions as unknown as Record<string, unknown>[]}
           actionButtons={false}
           onRowClick={(row) => {
             onNavigate("transaction-details", { razorpayOrderId: row.razorpayOrderId });
           }}
         />
       )}
     </div>
    </div>
  );
}
