import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { ReactNode } from "react";

type ViewMode = "grid" | "list";

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onShowSizeChange?: (current: number, size: number) => void;
}

interface GridListPaginateProps<T extends object> {
  data: T[];
  renderItem: (item: T, index: number, mode: ViewMode) => ReactNode;
  viewMode?: ViewMode;
  pagination?: PaginationConfig | false;
  loading?: boolean;
  emptyText?: string;
}

export default function GridListPaginate<T extends object>({
  data,
  renderItem,
  viewMode = "grid",
  pagination = false,
  loading = false,
  emptyText = "Tidak ada data",
}: GridListPaginateProps<T>) {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  const itemStart = pagination
    ? pagination.total === 0
      ? 0
      : (pagination.current - 1) * pagination.pageSize + 1
    : 0;

  const itemEnd = pagination
    ? Math.min(pagination.current * pagination.pageSize, pagination.total)
    : 0;

  return (
    <div>
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "w-full h-fit grid gap-6 my-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "w-full h-fit flex flex-col gap-4 my-6"
          }
        >
          {Array.from({ length: pagination ? pagination.pageSize : 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-3 animate-pulse"
              >
                <div className="w-full h-auto aspect-video bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mt-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </div>
            ),
          )}
        </div>
      ) : data.length === 0 ? (
        <div className="w-full py-10 text-center text-gray-500">
          {emptyText}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "w-full h-fit grid gap-6 my-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "w-full h-fit flex flex-col gap-4 my-6"
          }
        >
          {data.map((item, index) => (
            <div key={index}>{renderItem(item, index, viewMode)}</div>
          ))}
        </div>
      )}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-transparent ">
          <div className="flex items-center gap-4">
            <span className="text-sm max-sm:text-xs text-gray-700">
              {itemStart} - {itemEnd} dari {pagination.total} data
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                pagination.onChange(
                  Math.max(1, pagination.current - 1),
                  pagination.pageSize,
                )
              }
              disabled={pagination.current === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm max-sm:text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>
            <span className="text-sm max-sm:text-xs text-gray-700">
              {pagination.current} dari {totalPages}
            </span>
            <button
              onClick={() =>
                pagination.onChange(
                  Math.min(totalPages, pagination.current + 1),
                  pagination.pageSize,
                )
              }
              disabled={pagination.current === totalPages}
              className="flex items-center max-sm:text-xs gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
              <MdChevronRight className="w-4 h-4" />
            </button>
          </div>
          {pagination.showSizeChanger && (
            <div className="flex items-center gap-2">
              <span className="text-sm max-sm:text-xs text-gray-700">
                Data:
              </span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  pagination.onChange(1, newSize);
                  pagination.onShowSizeChange?.(1, newSize);
                }}
                className="px-2 py-1 text-sm max-sm:text-xs border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {(pagination.pageSizeOptions || [10, 20, 50, 100]).map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
