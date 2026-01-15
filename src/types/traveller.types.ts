export interface Traveller {
  userId: string;
  fullName: string;
  email: string;
  dateJoined: string;
  status: string;
  blockReason?: string | null;
  [key: string]: unknown;
}

export interface BookedStory {
  bookingId: string;
  storyName: string;
  hostName: string;
  bookingDate: string;
  tripStartDate: string;
  tripEndDate: string;
  amountPaid: number;
  bookingStatus: string;
  [key: string]: unknown;
}

export interface TravellerDetails {
  basicInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    userId: string;
    role: string;
    dateJoined: string;
    status: string;
    blockReason: string | null;
  };
  statistics: {
    totalBookings: number;
    totalAmountSpent: number;
    completedTrips: number;
  };
  bookedStories: BookedStory[];
}

export interface TravellerPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TravellerState {
  travellers: Traveller[];
  travellerDetails: TravellerDetails | null;
  pagination: TravellerPagination | null;
  isLoading: boolean;
  error: string | null;
}

export interface FetchTravellersParams {
  page: number;
  limit: number;
  sort: string;
  status: string;
  search?: string;
}
