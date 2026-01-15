export interface Host {
  hostID: string;
  userID: string;
  fullName: string;
  emailID: string;
  mobileNumber: string;
  nationality: string;
  dateJoined: string;
  status?: string;
  blockReason?: string;
  rejectReason?: string;
  [key: string]: unknown;
}

export interface HostStory {
  storyId: string;
  storyName: string;
  destination: string;
  state: string;
  status: string;
  bookingsCount: number;
  earnings: number;
  [key: string]: unknown;
}

export interface HostDetails {
  hostId: string;
  userId: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  mobileNumber: string;
  nationality: string;
  location: string;
  status: string;
  blockReason: string | null;
  rejectReason: string | null;
  isActive: boolean;
  onboardingSummary: {
    currentStep: number;
    totalSteps: number;
    isComplete: boolean;
    completionPercentage: number;
  };
  personalInfo: {
    age: number;
    gender: string;
    nationality: string;
    location: string;
    aadharNumber: string;
  };
  documents: {
    aadharDocs: Array<{ url: string; status: string }>;
    pccCertificateUrl: string | null;
    livePicUrl: string | null;
  };
  statistics: {
    totalStories: number;
    pendingApprovals: number;
    totalBookings: number;
    totalEarnings: number;
  };
  stories: HostStory[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HostState {
  hosts: Host[];
  hostDetails: HostDetails | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

export interface FetchHostsParams {
  page: number;
  limit: number;
  sort: string;
  status: string;
  search?: string;
}
