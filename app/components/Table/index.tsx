import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

export interface TableProps<T> {
  data: T[];
  isLoading?: boolean;
  emptyText?: string;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  renderHead: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function Table<T>({
  data,
  isLoading,
  emptyText = "Tidak ada data",
  meta,
  onPageChange,
  limit,
  onLimitChange,
  renderHead,
  renderRow,
}: TableProps<T>) {
  const { currentPage, lastPage, total, perPage } = meta;
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage || isLoading) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < lastPage - 2) pages.push("...");
      pages.push(lastPage);
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="m-4 overflow-x-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">{renderHead()}</thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between flex-row w-full gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
          <div className="text-sm text-gray-700">
            <span className="font-medium">{startItem}</span> -{" "}
            <span className="font-medium">{endItem}</span> dari{" "}
            <span className="font-medium">{total}</span> data
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  disabled={isLoading}
                  className={`min-w-10 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  } disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-between flex-row gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Tampilkan:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={isLoading}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage || isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
            <MdChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
