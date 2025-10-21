"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PencilLine,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useReducer } from "react";

// Generic row type
export interface RowItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joinDate: string;
}

interface TableState {
  currentPage: number;
  selectedRows: number[];
  searchQuery: string;
}

type TableAction =
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SELECTED_ROWS"; payload: number[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_ROW_SELECTION"; payload: { id: number; checked: boolean } }
  | {
      type: "SELECT_ALL";
      payload: { checked: boolean; currentData: RowItem[] };
    }
  | { type: "CLEAR_SELECTION" }
  | { type: "RESET_PAGE" };

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SELECTED_ROWS":
      return { ...state, selectedRows: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case "TOGGLE_ROW_SELECTION":
      const { id, checked } = action.payload;
      return {
        ...state,
        selectedRows: checked
          ? [...state.selectedRows, id]
          : state.selectedRows.filter((rowId) => rowId !== id),
      };
    case "SELECT_ALL":
      return {
        ...state,
        selectedRows: action.payload.checked
          ? action.payload.currentData.map((item) => item.id)
          : [],
      };
    case "CLEAR_SELECTION":
      return { ...state, selectedRows: [] };
    case "RESET_PAGE":
      return { ...state, currentPage: 1 };
    default:
      return state;
  }
};

const initialState: TableState = {
  currentPage: 1,
  selectedRows: [],
  searchQuery: "",
};

interface DataTableProps {
  itemsPerPage?: number;
  data: RowItem[];
}

export default function DemoTable({ itemsPerPage = 5, data }: DataTableProps) {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  const { currentPage, selectedRows, searchQuery } = state;

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: value });
  };

  const handleSelectAll = (checked: boolean) => {
    dispatch({ type: "SELECT_ALL", payload: { checked, currentData } });
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    dispatch({ type: "TOGGLE_ROW_SELECTION", payload: { id, checked } });
  };

  const isAllSelected =
    currentData.length > 0 &&
    currentData.every((item) => selectedRows.includes(item.id));

  const handleBulkDelete = () => {
    console.log("[v0] Bulk delete action for rows:", selectedRows);
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleBulkActivate = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleRowAction = (action: string, rowId: number) => {};

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedRows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions ({selectedRows.length})
                <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBulkActivate}>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleBulkDelete}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableHead>
              <TableHead className="font-semibold">
                Name
              </TableHead>
              <TableHead className="font-semibold">
                Email
              </TableHead>
              <TableHead className="font-semibold">
                Phone
              </TableHead>
              <TableHead className="font-semibold">
                Department
              </TableHead>
              <TableHead className="font-semibold">
                Status
              </TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchQuery
                    ? `No rows found matching "${searchQuery}"`
                    : "No rows found"}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-background" : "bg-card"
                  } hover:bg-muted/50 transition-colors`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item.id, checked as boolean)
                      }
                      aria-label={`Select ${item.name}`}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {item.email}
                  </TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.joinDate}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <PencilLine /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500!">
                          <Trash2 className="text-red-500" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length > 0 && (
            <span>
              {selectedRows.length} of {filteredData.length} row(s) selected
            </span>
          )}
          {searchQuery && (
            <span className="ml-2">
              ({filteredData.length} of {data.length} rows shown)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: Math.max(currentPage - 1, 1),
                })
              }
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Go to previous page</span>
            </Button>

            {getPaginationNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      dispatch({
                        type: "SET_CURRENT_PAGE",
                        payload: page as number,
                      })
                    }
                    className={`h-8 w-8 p-0 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-muted"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: Math.min(currentPage + 1, totalPages),
                })
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Go to next page</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
