

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../../redux/slices/storySlice/storySlice";
import { RootState, AppDispatch } from "../../../redux/store";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import ActionDropdown from "../../../components/ui/actionDropdown";
import { BasicModal } from "../../../components/ui/basicModel";
import Button from "../../../components/ui/button";
import { showErrorAlert } from "../../../utils/swal";
import { Story } from "../../../types/story.types";

export default function Stories({ onNavigate }: { onNavigate: (page: string, data?: unknown) => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, pagination, isLoading, error } = useSelector((state: RootState) => state.story);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState("A-Z");
  const [statusValue, setStatusValue] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'block' | 'unblock'>('block');
  const [reason, setReason] = useState("");
  const [currentRow, setCurrentRow] = useState<Story | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    dispatch(fetchStories({ page, limit, sort: sortValue, status: statusValue, storyType: "ALL", search: debouncedSearch }));
  }, [dispatch, page, sortValue, statusValue, debouncedSearch, limit]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  const columns = [
    { label: "Story Name", accessor: "storyName" },
    { label: "Host Name", accessor: "hostName" },
    { 
      label: "Price", 
      accessor: "price",
      render: (value: unknown) => {
        const price = value as number;
        return price ? `$${price.toFixed(2)}` : '$0.00';
      }
    },
    { 
      label: "Story Length", 
      accessor: "storyLength",
      render: (value: unknown) => {
        const length = value as number;
        return length ? `${length} days` : '0 days';
      }
    },
    { 
      label: "Status", 
      accessor: "status",
      render: (value: unknown) => {
        const statusStr = value as string;
        const statusColors: { [key: string]: string } = {
          active: "bg-green-100 text-green-800",
          published: "bg-blue-100 text-blue-800",
          blocked: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        
        let normalizedValue = statusStr?.toLowerCase();
        let displayStatus = statusStr;
        
        // Treat anything other than ACTIVE, PUBLISHED, BLOCKED as pending
        if (normalizedValue !== 'active' && normalizedValue !== 'published' && normalizedValue !== 'blocked') {
          normalizedValue = 'pending';
          displayStatus = 'Pending';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizedValue] || "bg-gray-100 text-gray-800"}`}>
            {displayStatus || 'Unknown'}
          </span>
        );
      }
    },
    { label: "Total Bookings", accessor: "totalBooking" },
  ];
  const handleDelete = (row: Story) => {
    console.log("Delete", row);
  };

  const handleBlockUnblock = (row: Story) => {
    const action = row.status?.toUpperCase() === "ACTIVE" ? "block" : "unblock";
    console.log(action, row, "with reason:", reason);
    setIsModalOpen(false);
    setReason("");
    setCurrentRow(null);
  };

  const renderActions = (row: Story) => {
    const isActive = row.status?.toUpperCase() === "ACTIVE";
    return (
      <ActionDropdown
        buttons={[
          {
            label: "Delete",
            variant: "delete" as const,
            onClick: (row) => handleDelete(row),
          },
          {
            label: isActive ? "Block" : "Unblock",
            variant: isActive ? "block" : "unblock" as const,
            onClick: (row) => {
              if (isActive) {
                setModalType('block');
                setCurrentRow(row);
                setIsModalOpen(true);
              } else {
                handleBlockUnblock(row);
              }
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
      <h1 className="text-2xl font-semibold text-gray-900">Stories Details and Views</h1>
      <div className="text-right">
       <p className="text-sm text-gray-600">Total Stories</p>
       <p className="text-2xl font-bold text-[#FF2B36]">{pagination?.total || 0}</p>
      </div>
     </div>
     <div className="w-full flex justify-between items-center gap-4 mt-10">
      <InputField
        placeholder="Search stories..."
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
            { label: "Price", value: "Price" },
          ]}
          placeholder="Sort by"
          value={sortValue}
          onChange={(value) => {
            setSortValue(value);
            setPage(1);
          }}
          width="w-32"
        />
        <Dropdown
          options={[
            { label: "All", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Blocked", value: "BLOCKED" },
          ]}
          placeholder="Status"
          value={statusValue}
          onChange={(value) => {
            setStatusValue(value);
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
           data={stories}
           actionButtons={true}
           renderActions={renderActions}
           onRowClick={(row) => {
             onNavigate("story-details", { storyId: row.storyId });
           }}
         />
       )}
     </div>
     <BasicModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       title={modalType === 'block' ? 'Block reason' : 'Unblock reason'}
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
               label={modalType === 'block' ? 'Block' : 'Unblock'}
               onClick={() => {
                 if (currentRow) {
                   handleBlockUnblock(currentRow);
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
