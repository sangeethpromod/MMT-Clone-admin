

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTravellers } from "../../../redux/slices/travellerSlice/travellerSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import ActionDropdown from "../../../components/ui/actionDropdown";
import { showErrorAlert } from "../../../utils/swal";
import { Traveller } from "../../../types/traveller.types";

export default function TravellerUser({ onNavigate }: { onNavigate: (page: string, data?: string) => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { travellers, pagination, isLoading, error } = useSelector((state: RootState) => state.traveller);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState("A-Z");
  const [statusValue, setStatusValue] = useState("ALL");
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
    dispatch(fetchTravellers({ page, limit, sort: sortValue, status: statusValue, search: debouncedSearch }));
  }, [dispatch, page, sortValue, statusValue, debouncedSearch, limit]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  const columns = [
    { label: "Full Name", accessor: "fullName" },
    { label: "Email", accessor: "email" },
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
          active: "bg-green-100 text-green-800",
          blocked: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
          suspended: "bg-gray-100 text-gray-800",
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
  const handleDelete = (row: Traveller) => {
    console.log("Delete", row);
  };

  const handleBlock = (row: Traveller) => {
    console.log("Block", row);
  };

  const handleUnblock = (row: Traveller) => {
    console.log("Unblock", row);
  };

  const renderActions = (row: Traveller) => (
    <ActionDropdown
      buttons={[
        {
          label: row.status === "BLOCKED" ? "Unblock" : "Block",
          variant: row.status === "BLOCKED" ? "unblock" : "block",
          onClick: (row) => row.status === "BLOCKED" ? handleUnblock(row) : handleBlock(row),
        },
        {
          label: "Delete",
          variant: "delete" as const,
          onClick: (row) => handleDelete(row),
        },
      ]}
      row={row}
      onClose={() => {}}
    />
  );

  return (
    <div className="px-4 py-8">
     <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Traveller List and Details</h1>
      <div className="text-right">
       <p className="text-sm text-gray-600">Total Travellers</p>
       <p className="text-2xl font-bold text-[#FF2B36]">{pagination?.total || 0}</p>
      </div>
     </div>
     <div className="w-full flex justify-between items-center gap-4 mt-10">
      <InputField
        placeholder="Search travellers..."
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
        <Dropdown
          options={[
            { label: "All", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Pending", value: "PENDING" },
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
           data={travellers}
           actionButtons={true}
           renderActions={renderActions}
           onRowClick={(row) => onNavigate("traveller-details", row.userId)}
         />
       )}
     </div>
    </div>
  );
}
