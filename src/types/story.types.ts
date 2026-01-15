export interface Story {
  storyId: string;
  storyName: string;
  hostName: string;
  storyType: string;
  price: number;
  storyLength: number;
  status: string;
  totalBooking: number;
  [key: string]: unknown;
}

export interface StoryDetails {
  storyId: string;
  storyTitle: string;
  status: string;
  blockReason: string | null;
  createdBy: {
    userId: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  storyDescription: string;
  state: string;
  location: string;
  locationDetails: {
    geoPoint: {
      type: string;
      coordinates: [number, number];
    };
    lat: number;
    lon: number;
    displayName: string;
    name: string;
    state: string;
    district: string;
    suburb: string;
    postcode: string;
    country: string;
    countryCode: string;
    boundingBox: [number, number, number, number];
  };
  availabilityType: string;
  tags: string[];
  availabilityDetails: {
    storyLength: number;
    maxTravelersPerDay: number;
    startDate: string | null;
    endDate: string | null;
    maxTravellersScheduled: number | null;
  };
  hostDetails: {
    locationType: string;
    pickupLocation: string;
    pickupGoogleMapLink: string;
    dropOffLocation: string;
    dropOffGoogleMapLink: string;
    hostName: string;
    hostDescription: string;
  };
  pricingDetails: {
    pricingType: string;
    amount: number;
    discount: number;
    platformFee: number;
    totalPrice: number;
    priceBreakdown: Array<{
      label: string;
      value: number;
    }>;
  };
  storyImages: {
    bannerImage: {
      key: string;
      url: string;
    };
    storyImage: {
      key: string;
      url: string;
    };
    otherImages: Array<{
      key: string;
      url: string;
    }>;
  };
  timing: {
    pickUpTime: string;
    dropOffTime: string;
    pickUpTimeRaw: string;
    dropOffTimeRaw: string;
  };
  itinerary: Array<{
    day: number;
    activities: Array<{
      type: string;
      activityName: string;
      activityDescription: string;
      activityTime: string;
      activityDuration: string;
      activityLocation: string;
    }>;
  }>;
}

export interface StoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoryState {
  stories: Story[];
  storyDetails: StoryDetails | null;
  pagination: StoryPagination | null;
  isLoading: boolean;
  error: string | null;
}

export interface FetchStoriesParams {
  page: number;
  limit: number;
  sort: string;
  status: string;
  storyType: string;
  search?: string;
}