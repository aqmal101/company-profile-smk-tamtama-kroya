
export interface Column<T = unknown> {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onChange: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

export interface ReusableTableProps<T = unknown> {
  // Allow columns to be defined with their own record type (e.g., Column<Student>),
  // so use Column<any>[] to avoid strict generic mismatch during JSX inference.
  columns: Column<any>[];
  dataSource: T[];
  pagination?: PaginationConfig | false;
  loading?: boolean;
  rowKey?: string | ((record: T, index: number) => string);
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  emptyText?: string;
  className?: string;
  error?: string;
  serverSidePagination?: boolean; // New prop
  /** Table layout mode — 'auto' (default) or 'fixed' to respect column widths */
  tableLayout?: "auto" | "fixed";
}