import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTravellerDetails } from "../../../redux/slices/travellerSlice/travellerSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { showErrorAlert } from "../../../utils/swal";
import KPICard from "../../../components/ui/kpiCard";
import ReusableTable from "../../../components/template/table";
import { Calendar, MapPin, CreditCard } from "lucide-react";

const TravellerDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { travellerDetails, isLoading, error } = useSelector((state: RootState) => state.traveller);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTravellerDetails(userId));
    } else {
      console.error('No userId provided to TravellerDetails');
    }
  }, [dispatch, userId]);

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

  if (!travellerDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Traveller details not found</p>
      </div>
    );
  }

  const bookedStoriesColumns = [
    { label: "Story Name", accessor: "storyName" },
    { label: "Host Name", accessor: "hostName" },
    { 
      label: "Booking Date", 
      accessor: "bookingDate",
      render: (value: unknown) => {
        const dateStr = value as string;
        return new Date(dateStr).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    { 
      label: "Trip Start Date", 
      accessor: "tripStartDate",
      render: (value: unknown) => {
        const dateStr = value as string;
        return new Date(dateStr).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    { 
      label: "Trip End Date", 
      accessor: "tripEndDate",
      render: (value: unknown) => {
        const dateStr = value as string;
        return new Date(dateStr).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    { 
      label: "Amount Paid", 
      accessor: "amountPaid",
      render: (value: unknown) => {
        const amount = value as number;
        return `₹${amount.toLocaleString()}`;
      }
    },
    { 
      label: "Booking Status", 
      accessor: "bookingStatus",
      render: (value: unknown) => {
        const statusStr = value as string;
        const statusColors: { [key: string]: string } = {
          completed: "bg-green-100 text-green-800",
          upcoming: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        const normalizedValue = statusStr?.toLowerCase();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizedValue] || "bg-gray-100 text-gray-800"}`}>
            {statusStr}
          </span>
        );
      }
    },
  ];

  const renderBookedStoriesActions = () => null;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-white">
      {/* Identity Overview (Header) */}
      <div
        className="rounded-md border border-gray-200 p-4 mb-6"
        style={{ background: 'linear-gradient(to right, rgba(255, 0, 0, 0.052), rgba(88, 96, 255, 0.052), rgba(251, 147, 0, 0.052))' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{travellerDetails.basicInfo.fullName}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold text-[#FF2B36]">Email:</span> {travellerDetails.basicInfo.email}</div>
              <div><span className="font-semibold text-[#FF2B36]">Phone Number:</span> {travellerDetails.basicInfo.phoneNumber}</div>
              <div><span className="font-semibold text-[#FF2B36]">User ID:</span> {travellerDetails.basicInfo.userId}</div>
              <div><span className="font-semibold text-[#FF2B36]">Role:</span> {travellerDetails.basicInfo.role}</div>
              <div>
                <span className="font-semibold text-[#FF2B36]">Date Joined:</span>{' '}
                {new Date(travellerDetails.basicInfo.dateJoined).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              travellerDetails.basicInfo.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {travellerDetails.basicInfo.status}
            </span>
          </div>
        </div>
        {travellerDetails.basicInfo.blockReason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <span className="font-semibold text-[#FF2B36]">Block Reason:</span> {travellerDetails.basicInfo.blockReason}
          </div>
        )}
      </div>

      {/* Booking KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          label="Total Number of Bookings"
          value={travellerDetails.statistics.totalBookings.toString()}
          icon={<Calendar className="w-5 h-5" />}
        />
        <KPICard
          label="Total Amount Spent"
          value={`₹${travellerDetails.statistics.totalAmountSpent.toLocaleString()}`}
          icon={<CreditCard className="w-5 h-5" />}
        />
        <KPICard
          label="Total Completed Trips"
          value={travellerDetails.statistics.completedTrips.toString()}
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>

      {/* Booked Stories Table */}
      <div className="bg-white rounded-md border border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Booked Stories</h2>
        {travellerDetails.bookedStories.length > 0 ? (
          <ReusableTable
            columns={bookedStoriesColumns}
            data={travellerDetails.bookedStories}
            actionButtons={true}
            renderActions={renderBookedStoriesActions}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">No booked stories found.</p>
        )}
      </div>
    </div>
  );
};

export default TravellerDetails;
