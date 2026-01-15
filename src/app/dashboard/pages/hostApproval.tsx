

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHosts, approveHost, blockHost } from "../../../redux/slices/hostSlice/hostSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import ActionDropdown from "../../../components/ui/actionDropdown";
import { BasicModal } from "../../../components/ui/basicModel";
import Button from "../../../components/ui/button";
import { showErrorAlert, showSuccessAlert } from "../../../utils/swal";
import { Host } from "../../../types/host.type";

export default function HostApproval() {
  const dispatch = useDispatch<AppDispatch>();
  const { hosts, pagination, isLoading, error } = useSelector((state: RootState) => state.host);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState("A-Z");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reject' | 'block'>('reject');
  const [reason, setReason] = useState("");
  const [currentRow, setCurrentRow] = useState<Host | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    dispatch(fetchHosts({ page, limit, sort: sortValue, status: 'PENDING', search: debouncedSearch }));
  }, [dispatch, page, sortValue, debouncedSearch, limit]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  const columns = [
    { label: "Full Name", accessor: "fullName" },
    { label: "Email", accessor: "emailID" },
    { label: "Mobile Number", accessor: "mobileNumber" },
    { label: "Nationality", accessor: "nationality" },
    { 
      label: "Date Joined", 
      accessor: "dateJoined",
      render: (value: unknown) => {
        const dateStr = value as string;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    { 
      label: "Status", 
      accessor: "status",
      render: (value: unknown) => {
        const statusStr = value as string;
        const statusColors: { [key: string]: string } = {
          pending: "bg-yellow-100 text-yellow-800",
          active: "bg-green-100 text-green-800",
          blocked: "bg-red-100 text-red-800",
          rejected: "bg-gray-100 text-gray-800",
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
  const handleApprove = async (row: Host) => {
    try {
      await dispatch(approveHost(row.hostID)).unwrap();
      showSuccessAlert('Success', 'Host approved successfully');
      dispatch(fetchHosts({ page, limit, sort: sortValue, status: 'PENDING', search: debouncedSearch }));
    } catch (error) {
      showErrorAlert('Error', error as string);
    }
  };

  const handleReject = (row: Host) => {
    console.log("Reject", row, "with reason:", reason);
    setIsModalOpen(false);
    setReason("");
    setCurrentRow(null);
  };

  const handleBlock = async (row: Host) => {
    if (!reason.trim()) {
      showErrorAlert('Error', 'Please provide a reason for blocking');
      return;
    }
    try {
      await dispatch(blockHost({ hostId: row.hostID, blockReason: reason })).unwrap();
      showSuccessAlert('Success', 'Host blocked successfully');
      setIsModalOpen(false);
      setReason("");
      setCurrentRow(null);
      dispatch(fetchHosts({ page, limit, sort: sortValue, status: 'PENDING', search: debouncedSearch }));
    } catch (error) {
      showErrorAlert('Error', error as string);
    }
  };

  const renderActions = (row: Host) => {
    const isPending = row.status?.toLowerCase() === 'pending';
    
    return (
      <ActionDropdown
        buttons={isPending ? [
          {
            label: "Approve",
            variant: "approve" as const,
            onClick: (row) => handleApprove(row),
          },
          {
            label: "Block",
            variant: "block" as const,
            onClick: (row) => {
              setModalType('block');
              setCurrentRow(row);
              setIsModalOpen(true);
            },
          },
        ] : [
          {
            label: "Reject",
            variant: "delete" as const,
            onClick: (row) => {
              setModalType('reject');
              setCurrentRow(row);
              setIsModalOpen(true);
            },
          },
          {
            label: "Block",
            variant: "block" as const,
            onClick: (row) => {
              setModalType('block');
              setCurrentRow(row);
              setIsModalOpen(true);
            },
          },
        ]}
        row={row}
        onClose={() => {}}
      />
    );
  };

  return (
    <div className="px-4 py-8">
     <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Verification and Approval for Host</h1>
      <div className="text-right">
       <p className="text-sm text-gray-600">Total Hosts</p>
       <p className="text-2xl font-bold text-[#FF2B36]">{pagination?.total || 0}</p>
      </div>
     </div>
     <div className="w-full flex justify-between items-center gap-4 mt-10">
      <InputField
        placeholder="Search hosts..."
        width="w-full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex gap-4">
        <Dropdown
          options={[
            { label: "A-Z", value: "A-Z" },
            { label: "Z-A", value: "Z-A" },
            { label: "Date Joined", value: "DateJoined" },
          ]}
          placeholder="Sort by"
          value={sortValue}
          onChange={(value) => {
            setSortValue(value);
            setPage(1);
          }}
          width="w-32"
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
           data={hosts}
           actionButtons={true}
           renderActions={renderActions}
         />
       )}
     </div>
     <BasicModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       title={modalType === 'reject' ? 'Rejection reason' : 'Block reason'}
       modalContent={
         <div className="p-4">
           <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
           <textarea
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             className="w-full rounded-sm border border-[#e4e4e4] bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#e4e4e4] h-24 resize-none"
             placeholder="Enter reason..."
           />
           <div className="flex gap-2 mt-4">
             <Button
               variant="primary"
               label={modalType === 'reject' ? 'Reject' : 'Block'}
               onClick={() => {
                 if (currentRow) {
                   if (modalType === 'reject') {
                     handleReject(currentRow);
                   } else {
                     handleBlock(currentRow);
                   }
                 }
               }}
               width="w-full"
             />
             <Button
               variant="secondary"
               label="Cancel"
               onClick={() => setIsModalOpen(false)}
               width="w-full"
             />
           </div>
         </div>
       }
     />
    </div>
  );
}
