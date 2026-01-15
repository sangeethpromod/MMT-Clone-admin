

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFees, deleteFee } from "../../../redux/slices/feeSlice/feeSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import ReusableTable from "../../../components/template/table";
import ActionDropdown from "../../../components/ui/actionDropdown";
import { BasicModal } from "../../../components/ui/basicModel";
import Button from "../../../components/ui/button";
import { showErrorAlert, showSuccessAlert } from "../../../utils/swal";
import { Fee } from "../../../types/fee.type";

interface CommissionListProps {
  onNavigate: (page: string, data?: string) => void;
}

export default function CommissionList({ onNavigate }: CommissionListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { fees, isLoading, error } = useSelector((state: RootState) => state.fee);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<Fee | null>(null);

  useEffect(() => {
    dispatch(fetchFees());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  const formattedFees = fees.map(fee => ({
    ...fee,
    formattedValue: fee.feeType === 'FLAT' ? `₹${fee.value}` : `${fee.value}%`,
  }));

  const columns = [
    { label: "Fee Name", accessor: "feeName" },
    { label: "Fee Type", accessor: "feeType" },
    { label: "Value", accessor: "formattedValue" },
    { label: "Applies To", accessor: "appliesTo" },
    { label: "Scope", accessor: "scope" },
    { label: "Active", accessor: "isActive" },
  ];
  const handleEdit = (row: Fee) => {
    onNavigate("fee-edit", row.feeId);
  };

  const handleDelete = (row: Fee) => {
    setCurrentFee(row);
    setIsModalOpen(true);
  };

  const submitDelete = async () => {
    if (!currentFee) return;
    try {
      await dispatch(deleteFee(currentFee.feeId)).unwrap();
      showSuccessAlert('Success', 'Fee deleted successfully');
      setIsModalOpen(false);
      setCurrentFee(null);
    } catch (error) {
      showErrorAlert('Error', error as string);
    }
  };

  const renderActions = (row: Fee) => (
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
     <h1 className="text-2xl font-semibold text-gray-900">Fee List</h1>
     <div className="w-full flex justify-between items-center gap-4 mt-10">
      <InputField
        placeholder="Search fees..."
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
          width="w-32"
        />
        <Dropdown
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          placeholder="Status"
          value={statusValue}
          onChange={setStatusValue}
          width="w-32"
        />
        <Button variant="primary" label="Create New Fee" width="w-48" onClick={() => onNavigate("fee-create")} />
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
           data={formattedFees}
           actionButtons={true}
           renderActions={renderActions}
           onRowClick={(row) => handleEdit(row)}
         />
       )}
     </div>
     <BasicModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       title="Delete Fee"
       modalContent={
         <div className="p-4">
           <p className="text-sm text-gray-700 mb-4">
             Are you sure you want to delete this fee? This action cannot be undone.
           </p>
           <div className="flex gap-2">
             <Button
               variant="primary"
               label="Delete"
               onClick={submitDelete}
               width="w-full"
             />
             <Button
               variant="secondary"
               label="Cancel"
               onClick={() => {
                 setIsModalOpen(false);
                 setCurrentFee(null);
               }}
               width="w-full"
             />
           </div>
         </div>
       }
     />
    </div>
  );
}
