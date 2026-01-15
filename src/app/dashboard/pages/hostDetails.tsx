import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostDetails } from "../../../redux/slices/hostSlice/hostSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { showErrorAlert } from "../../../utils/swal";
import KPICard from "../../../components/ui/kpiCard";
import ReusableTable from "../../../components/template/table";
import { TrendingUp, Users, BookOpen, DollarSign, FileChartColumn } from "lucide-react";
import { HostStory } from "../../../types/host.type";

const HostDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { hostDetails, isLoading, error } = useSelector((state: RootState) => state.host);

  useEffect(() => {
    if (userId) {
      dispatch(fetchHostDetails(userId));
    } else {
      console.error('No userId provided to HostDetails');
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

  if (!hostDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Host details not found</p>
      </div>
    );
  }

  const handleViewStory = (story: HostStory) => {
    console.log("View Story", story);
  };

  const storyColumns = [
    { label: "Story Name", accessor: "storyName" },
    { label: "Destination", accessor: "destination" },
    { label: "State", accessor: "state" },
    { 
      label: "Status", 
      accessor: "status",
      render: (value: unknown) => {
        const statusStr = value as string;
        const statusColors: { [key: string]: string } = {
          active: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          rejected: "bg-red-100 text-red-800",
        };
        const normalizedValue = statusStr?.toLowerCase();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizedValue] || "bg-gray-100 text-gray-800"}`}>
            {statusStr}
          </span>
        );
      }
    },
    { label: "Bookings Count", accessor: "bookingsCount" },
    { 
      label: "Earnings", 
      accessor: "earnings",
      render: (value: unknown) => {
        const earnings = value as number;
        return `₹${earnings.toLocaleString()}`;
      }
    },
  ];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-white ">
      {/* Header Section */}
      <div 
        className="rounded-md border border-gray-200 p-4 mb-6"
        style={{ background: 'linear-gradient(to right, rgba(255, 0, 0, 0.082), rgba(88, 96, 255, 0.082), rgba(251, 147, 0, 0.082))' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{hostDetails.fullName}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Host ID:</span> {hostDetails.hostId}</div>
              <div><span className="font-medium">User ID:</span> {hostDetails.userId}</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span> {hostDetails.email}
                {hostDetails.isEmailVerified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Verified</span>
                )}
              </div>
              <div><span className="font-medium">Mobile:</span> {hostDetails.mobileNumber}</div>
              <div><span className="font-medium">Nationality:</span> {hostDetails.nationality}</div>
              <div><span className="font-medium">Location:</span> {hostDetails.location}</div>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hostDetails.onboardingSummary.isComplete 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {hostDetails.onboardingSummary.isComplete ? "Onboarding Complete" : "Onboarding Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Onboarding Summary */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Onboarding Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="font-medium">Onboarding Step:</span> {hostDetails.onboardingSummary.currentStep}/{hostDetails.onboardingSummary.totalSteps}
          </div>
          <div>
            <span className="font-medium">Completion Status:</span> {hostDetails.onboardingSummary.isComplete ? "Complete" : "Pending"}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#0c6a00] h-2 rounded-sm transition-all duration-300" 
            style={{ width: `${hostDetails.onboardingSummary.completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{hostDetails.onboardingSummary.completionPercentage}% Complete</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium">Age:</span> {hostDetails.personalInfo.age}</div>
          <div><span className="font-medium">Gender:</span> {hostDetails.personalInfo.gender}</div>
          <div><span className="font-medium">Nationality:</span> {hostDetails.personalInfo.nationality}</div>
          <div><span className="font-medium">Location:</span> {hostDetails.personalInfo.location}</div>
          <div className="col-span-2"><span className="font-medium">Aadhar Number:</span> {hostDetails.personalInfo.aadharNumber}</div>
        </div>
      </div>

      {/* Document Verification */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Document Verification</h2>
        <div className="flex gap-6">
          {/* Aadhar Documents */}
          <div className="flex-1">
            <h3 className="font-medium mb-2">Aadhar Documents</h3>
            {hostDetails.documents.aadharDocs.length > 0 ? (
              <div className="flex gap-2 mb-2">
                {hostDetails.documents.aadharDocs.map((doc, index) => (
                  <div key={index} className="relative">
                    <FileChartColumn 
                      size={48} 
                      className="cursor-pointer hover:text-blue-600 text-gray-600"
                    />
                    <span className={`text-xs ${doc.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            )}
          </div>

          {/* PCC Certificate */}
          <div className="flex-1">
            <h3 className="font-medium mb-2">PCC Certificate</h3>
            {hostDetails.documents.pccCertificateUrl ? (
              <FileChartColumn 
                size={48} 
                className="cursor-pointer hover:text-blue-600 text-gray-600"
              />
            ) : (
              <p className="text-sm text-gray-500">Not uploaded</p>
            )}
          </div>

          {/* Live Picture */}
          <div className="flex-1">
            <h3 className="font-medium mb-2">Live Picture</h3>
            {hostDetails.documents.livePicUrl ? (
              <FileChartColumn 
                size={48} 
                className="cursor-pointer hover:text-blue-600 text-gray-600"
              />
            ) : (
              <p className="text-sm text-gray-500">Not uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Host Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          label="Total Stories"
          value={hostDetails.statistics.totalStories}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <KPICard
          label="Pending Approvals"
          value={hostDetails.statistics.pendingApprovals}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPICard
          label="Total Bookings"
          value={hostDetails.statistics.totalBookings}
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          label="Total Earnings"
          value={`₹${hostDetails.statistics.totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Story List Preview */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="text-xl font-semibold text-[#FF2B36] mb-4">Story List Preview</h2>
        <ReusableTable
          columns={storyColumns}
          data={hostDetails.stories}
          onRowClick={(row) => handleViewStory(row)}
        />
      </div>
    </div>
  );
};

export default HostDetails;