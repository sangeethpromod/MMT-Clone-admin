import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionDetails } from '../../../redux/slices/transactionSlice/transactionsSlice';
import { RootState, AppDispatch } from '../../../redux/store';
import { showErrorAlert } from '../../../utils/swal';

interface TransactionDetailsProps {
  razorpayOrderId: string;
}

const DetailRow: React.FC<{ label: string; value: string; copy?: boolean }> = ({ label, value, copy }) => (
  <div className="flex justify-between px-4 py-3 text-sm">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-gray-900">{value}</span>
      {copy && (
        <button className="text-blue-600 hover:underline text-xs bg-transparent">
          Copy
        </button>
      )}
    </div>
  </div>
);

function TransactionDetails({ razorpayOrderId }: TransactionDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { transactionDetail, isLoadingDetail, error } = useSelector((state: RootState) => state.transactions);

  console.log('TransactionDetails - razorpayOrderId prop:', razorpayOrderId);

  useEffect(() => {
    if (error) {
      console.error('Transaction Details Error from Redux:', error);
      showErrorAlert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (razorpayOrderId) {
      console.log('Fetching details for transaction:', razorpayOrderId);
      dispatch(fetchTransactionDetails(razorpayOrderId));
    }
  }, [dispatch, razorpayOrderId]);

  if (!razorpayOrderId) {
    return (
      <div className="p-4 w-full h-auto flex flex-col">
        <div className="p-2 w-full border border-[#e4e4e4] rounded">
          <h1 className="text-xl font-semibold text-gray-900">Transaction Details</h1>
          <p className="text-gray-600 mt-2">No transaction ID provided</p>
        </div>
      </div>
    );
  }

  if (isLoadingDetail) {
    return (
      <div className="p-4 w-full h-auto flex flex-col">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2B36]"></div>
        </div>
      </div>
    );
  }

  if (!transactionDetail) {
    return (
      <div className="p-4 w-full h-auto flex flex-col">
        <div className="p-2 w-full border border-[#e4e4e4] rounded">
          <h1 className="text-xl font-semibold text-gray-900">Transaction Details</h1>
          <p className="text-gray-600 mt-2">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  const tx = transactionDetail;

  return (
    <div className="p-4 w-full h-full flex flex-col bg-amber-50 gap-4">
      <div className="w-full rounded-md border border-[#e4e4e4] p-4 bg-white flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-gray-900">₹{(tx.Amount / 100).toFixed(2)}</span>
          <span className="mt-1 text-sm text-gray-500">
            Created on: {tx.Date} at {tx.Time}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          Captured
        </div>
      </div>

      <div className="w-full rounded-md border border-[#e4e4e4] bg-white">
        <div className="px-4 py-3 border-b bg-[#e4e4e4] rounded-t-md">
          <h2 className="text-sm font-semibold text-black">Details</h2>
        </div>
        <div className="divide-y divide-[#e4e4e4]">
          <DetailRow label="Payment ID" value={tx.razorpayPaymentId} copy />
          <DetailRow label="Bank RRN" value={tx.bankRRN} />
          <DetailRow label="Order ID" value={tx.razorpayOrderId} copy />
          <DetailRow label="Invoice ID" value={tx.bookingId} />

          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-600">Payment method</span>
            <div className="text-right">
              <div className="text-gray-900">{tx.method.toUpperCase()}: ({tx.vpa})</div>
              <div className="text-gray-500 text-xs">Payer Account Type: --</div>
            </div>
          </div>

          <div className="px-4 py-3 text-sm">
            <span className="text-gray-600">Total Razorpay Fee</span>
            <div className="text-gray-900 font-medium">₹{(tx.feeDetails.totalFee / 100).toFixed(2)}</div>
            <div className="text-xs text-gray-500">Razorpay Fee – ₹{(tx.feeDetails.razorpayFee / 100).toFixed(2)}</div>
            <div className="text-xs text-gray-500">GST – ₹{(tx.feeDetails.gst / 100).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
