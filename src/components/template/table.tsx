import React, { useState } from "react";
import {
  PencilLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast
} from "lucide-react";

interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: Array<{ 
    label: string; 
    accessor: string;
    render?: (value: unknown, row: T) => React.ReactNode;
  }>;
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actionButtons?: boolean;
  renderActions?: (row: T) => React.ReactNode;
  height?: string;
  onRowClick?: (row: T) => void;
}

const ReusableTable = <T extends Record<string, unknown> = Record<string, unknown>,>({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  actionButtons = false,
  renderActions,
  height = "30vh",
  onRowClick,
}: TableProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goToNextPage = () =>
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Table Container */}
      <div className="bg-white/80 rounded-sm border border-[#e4e4e4] overflow-auto" style={{ minHeight: height }}>
        <table className="table-auto w-full border-collapse">
          {/* Header */}
          <thead className="bg-[#ffe9e9] sticky top-0 z-10">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-left text-sm px-6 py-2 font-semibold text-gray-700 border-b border-r border-[#e4e4e4]"
                >
                  {col.label}
                </th>
              ))}

              {actionButtons && (
                <th className="text-left text-xs px-6 py-3 font-semibold text-gray-700 border-b border-[#e4e4e4]">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#fff8f8] transition-colors cursor-pointer" onClick={() => onRowClick?.(row)}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-2 text-sm text-gray-700 border-b border-r border-[#f1f1f1]"
                  >
                    {col.render ? (
                      col.render(row[col.accessor], row)
                    ) : col.accessor === "status" ? (
                      <span
                        className={`font-medium ${
                          (row[col.accessor] as string) === "Active"
                            ? "text-green-600"
                            : (row[col.accessor] as string) === "Blocked"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {row[col.accessor] as string}
                      </span>
                    ) : (
                      row[col.accessor] as React.ReactNode
                    )}
                  </td>
                ))}

                {actionButtons && (
                  <td className="px-6 py-2 border-b border-[#f1f1f1]">
                    {renderActions ? (
                      renderActions(row)
                    ) : (
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 bg-white rounded border border-[#DED300] hover:bg-gray-100"
                          >
                            <PencilLine size={16} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 bg-red-600 rounded hover:bg-red-700"
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="rounded-sm  flex items-center justify-between">
        {/* Left: entry count */}
        <div className="text-sm text-gray-600">
          {currentData.length === 0
            ? "0 selected."
            : `Showing ${startIndex + 1} to ${Math.min(
                endIndex,
                data.length
              )} of ${data.length} rows.`}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm">
            Rows per page
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page number */}
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="p-2 rounded border bg-white border-[#e4e4e4] hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronFirst size={16} />
            </button>

            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded border bg-white border-[#e4e4e4] hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded border bg-white border-[#e4e4e4] hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded border bg-white border-[#e4e4e4] hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLast size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
