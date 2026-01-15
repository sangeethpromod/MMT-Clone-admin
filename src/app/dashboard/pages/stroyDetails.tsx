import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoryDetails } from "../../../redux/slices/storySlice/storySlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { showErrorAlert } from "../../../utils/swal";
import ReusableTable from "../../../components/template/table";
import { MapPin, Clock, DollarSign, Calendar, Eye, Users, Mountain, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'Sightseeing': return <Eye className="w-4 h-4 text-blue-500" />;
    case 'Cultural': return <Users className="w-4 h-4 text-green-500" />;
    case 'Adventure': return <Mountain className="w-4 h-4 text-orange-500" />;
    default: return <Calendar className="w-4 h-4 text-gray-500" />;
  }
};

const StoryDetails: React.FC<{ storyId: string }> = ({ storyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { storyDetails, isLoading, error } = useSelector((state: RootState) => state.story);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (storyId) {
      dispatch(fetchStoryDetails(storyId));
    } else {
      console.error('No storyId provided to StoryDetails');
    }
  }, [dispatch, storyId]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2B36]"></div>
      </div>
    );
  }

  if (!storyDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Story details not found</p>
      </div>
    );
  }
  const priceBreakdownColumns = [
    { label: "Label", accessor: "label" },
    { label: "Value", accessor: "value" },
  ];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-white">
      {/* Story Header (Identity Block) */}
      <div
        className="rounded-md border border-gray-200 p-4 mb-6"
        style={{ background: 'linear-gradient(to right, rgba(255, 0, 0, 0.052), rgba(88, 96, 255, 0.052), rgba(251, 147, 0, 0.052))' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{storyDetails.storyTitle}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold text-[#FF2B36]">Story ID:</span> {storyDetails.storyId}</div>
              <div><span className="font-semibold text-[#FF2B36]">Created By:</span> {storyDetails.createdBy.fullName} ({storyDetails.createdBy.userId})</div>
              <div><span className="font-semibold text-[#FF2B36]">Created At:</span> {new Date(storyDetails.createdAt).toLocaleDateString()}</div>
              <div><span className="font-semibold text-[#FF2B36]">Updated At:</span> {new Date(storyDetails.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              storyDetails.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : storyDetails.status === "DRAFT"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {storyDetails.status}
            </span>
          </div>
        </div>
      </div>

      {/* Core Story Information */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Core Story Information</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm"><span className="font-semibold text-sm">Description:</span> {storyDetails.storyDescription}</div>
          <div className="text-sm"><span className="font-semibold text-sm">State:</span> {storyDetails.state}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Location:</span> {storyDetails.location}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Availability Type:</span> {storyDetails.availabilityType}</div>
        </div>
        <div>
          <span className="font-semibold text-sm">Tags:</span>
          <div className="flex gap-2 mt-2">
            {storyDetails.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Details */}
      <div className="bg-gray-50 rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Availability Details</h2>
        {storyDetails.availabilityType === "YEAR_ROUND" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm"><span className="font-semibold text-sm">Story Length:</span> {storyDetails.availabilityDetails.storyLength} days</div>
            <div className="text-sm"><span className="font-semibold text-sm">Max Travelers Per Day:</span> {storyDetails.availabilityDetails.maxTravelersPerDay}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm"><span className="font-semibold text-sm">Start Date:</span> {storyDetails.availabilityDetails.startDate ? new Date(storyDetails.availabilityDetails.startDate).toLocaleDateString() : 'N/A'}</div>
            <div className="text-sm"><span className="font-semibold text-sm">End Date:</span> {storyDetails.availabilityDetails.endDate ? new Date(storyDetails.availabilityDetails.endDate).toLocaleDateString() : 'N/A'}</div>
            <div className="text-sm"><span className="font-semibold text-sm">Max Travellers Scheduled:</span> {storyDetails.availabilityDetails.maxTravellersScheduled || 'N/A'}</div>
          </div>
        )}
      </div>

      {/* Host & Pickup/Dropoff Details */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Host & Pickup/Dropoff Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm"><span className="font-semibold text-sm">Location Type:</span> {storyDetails.hostDetails.locationType}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Pickup Location:</span> <a href={storyDetails.hostDetails.pickupGoogleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><MapPin className="w-4 h-4" /> {storyDetails.hostDetails.pickupLocation}</a></div>
          <div className="text-sm"><span className="font-semibold text-sm">Dropoff Location:</span> <a href={storyDetails.hostDetails.dropOffGoogleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><MapPin className="w-4 h-4" /> {storyDetails.hostDetails.dropOffLocation}</a></div>
          <div className="text-sm"><span className="font-semibold text-sm">Host Name:</span> {storyDetails.hostDetails.hostName}</div>
        </div>
        <div className="text-sm"><span className="font-semibold text-sm">Host Description:</span> {storyDetails.hostDetails.hostDescription}</div>
      </div>

      {/* Pricing Details */}
      <div className="bg-gray-50 rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Pricing Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm"><span className="font-semibold text-sm">Pricing Type:</span> {storyDetails.pricingDetails.pricingType}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Amount:</span> ₹{storyDetails.pricingDetails.amount}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Discount:</span> ₹{storyDetails.pricingDetails.discount}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Platform Fee:</span> ₹{storyDetails.pricingDetails.platformFee}</div>
          <div className="text-sm"><span className="font-semibold text-sm">Total Price:</span> ₹{storyDetails.pricingDetails.totalPrice}</div>
        </div>
        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Price Breakdown</h3>
          <ReusableTable
            columns={priceBreakdownColumns}
            data={storyDetails.pricingDetails.priceBreakdown}
          />
        </div>
      </div>

      {/* Pickup & Drop Timing */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Pickup & Drop Timing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm"><span className="font-semibold text-sm flex items-center gap-1"><Clock className="w-4 h-4" /> Pickup Time:</span> {storyDetails.timing.pickUpTime}</div>
          <div className="text-sm"><span className="font-semibold text-sm flex items-center gap-1"><Clock className="w-4 h-4" /> Dropoff Time:</span> {storyDetails.timing.dropOffTime}</div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="bg-gray-50 rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Itinerary</h2>
        <div className="space-y-8">
          {storyDetails.itinerary.map((day, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-[#FF2B36] opacity-30"></div>
              
              {/* Day header with timeline dot */}
              <div className="flex items-center mb-4">
                <div className="shrink-0 w-12 h-12 bg-[#FF2B36] rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">
                  {day.day}
                </div>
                <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
              </div>
              
              {/* Activities */}
              <div className="ml-16 space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="relative">
                    {/* Activity connector dot */}
                    <div className="absolute -left-6 top-4 w-3 h-3 bg-[#FF2B36] rounded-full border-2 border-white shadow-sm"></div>
                    
                    {/* Activity card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getActivityIcon(activity.type)}
                            <span className="font-semibold text-sm text-[#FF2B36]">{activity.type}</span>
                          </div>
                          <div className="text-sm"><span className="font-medium">Activity:</span> {activity.activityName}</div>
                          <div className="text-sm"><span className="font-medium">Time:</span> {activity.activityTime}</div>
                          <div className="text-sm"><span className="font-medium">Duration:</span> {activity.activityDuration}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm"><span className="font-medium">Description:</span> {activity.activityDescription}</div>
                          <div className="text-sm"><span className="font-medium">Location:</span> {activity.activityLocation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-md border border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {storyDetails.storyImages.bannerImage && (
            <div className="h-32 rounded overflow-hidden relative bg-gray-100">
              {imageLoadingStates['banner'] !== false && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2B36]"></div>
                </div>
              )}
              <Image
                src={storyDetails.storyImages.bannerImage.url}
                alt="Banner Image"
                fill
                className="object-cover hover:scale-105 transition-transform cursor-pointer"
                onLoad={() => setImageLoadingStates(prev => ({ ...prev, banner: false }))}
              />
            </div>
          )}
          {storyDetails.storyImages.storyImage && (
            <div className="h-32 rounded overflow-hidden relative bg-gray-100">
              {imageLoadingStates['story'] !== false && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2B36]"></div>
                </div>
              )}
              <Image
                src={storyDetails.storyImages.storyImage.url}
                alt="Story Image"
                fill
                className="object-cover hover:scale-105 transition-transform cursor-pointer"
                onLoad={() => setImageLoadingStates(prev => ({ ...prev, story: false }))}
              />
            </div>
          )}
          {storyDetails.storyImages.otherImages && storyDetails.storyImages.otherImages.map((image, index) => (
            <div key={index} className="h-32 rounded overflow-hidden relative bg-gray-100">
              {imageLoadingStates[`other-${index}`] !== false && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2B36]"></div>
                </div>
              )}
              <Image
                src={image.url}
                alt={`Other Image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform cursor-pointer"
                onLoad={() => setImageLoadingStates(prev => ({ ...prev, [`other-${index}`]: false }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryDetails;
