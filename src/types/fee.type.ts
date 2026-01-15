export interface Fee {
  feeId: string;
  feeName: string;
  feeType: string;
  value: number;
  appliesTo: string;
  scope: string;
  isActive: boolean;
}

export interface FeeState {
  fees: Fee[];
  currentFee: Fee | null;
  isLoading: boolean;
  error: string | null;
}