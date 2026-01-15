

import { useState } from "react";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import ActionDropdown from "../../../components/ui/actionDropdown";
import bookingData from "../data/bookinList.json";

type BookingRow = {
  bookingID: string;
  totalTravellers: number;
  storyName: string;
  totalAmount: number;
  date: string;
};

export default function BookingList() {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const columns = [
    { label: "Booking ID", accessor: "bookingID" },
    { label: "Total Travellers", accessor: "totalTravellers" },
    { label: "Story Name", accessor: "storyName" },
    { label: "Total Amount", accessor: "totalAmount" },
    { label: "Date", accessor: "date" },
  ];
  const handleDelete = (row: BookingRow) => {
    console.log("Delete", row);
  };

  const renderActions = (row: BookingRow) => (
    <ActionDropdown
      buttons={[
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
     <h1 className="text-2xl font-semibold text-gray-900">Booking List</h1>
     <div className="w-full flex justify-between items-center gap-4 mt-10">
      <InputField
        placeholder="Search bookings..."
        width="w-full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex gap-4">
        <Dropdown
          options={[
            { label: "Name A-Z", value: "name-asc" },
            { label: "Name Z-A", value: "name-desc" },
            { label: "Date Joined", value: "date-joined" },
            { label: "Revenue", value: "revenue" },
          ]}
          placeholder="Sort by"
          value={sortValue}
          onChange={setSortValue}
        />
        <Dropdown
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Suspended", value: "suspended" },
          ]}
          placeholder="Status"
          value={statusValue}
          onChange={setStatusValue}
        />
      </div>
     </div>
     <div className="mt-8">
       <ReusableTable
         columns={columns}
         data={bookingData}
         actionButtons={true}
         renderActions={renderActions}
       />
     </div>
    </div>
  );
}
