export interface Transaction {
  razorpayOrderId: string;
  storyName: string;
  TravellerName: string;
  amount: number;
  paymentMethod: string;
  DateOfPayment: string;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  pagination: TransactionPagination;
}
