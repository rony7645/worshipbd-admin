"use client";

import Pagination from "@/components/pagination";
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
import axios from "axios";
import {
  MoreHorizontal,
  PencilLine,
  Plus,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useReducer } from "react";
import z from "zod";
import DeleteConfirmation from "./delete-confirmation";
import TeamMemberForm from "./team-member-form";

export const TeamMembersSchema = z
  .object({
    _id: z.string(),
    title: z.string().min(1, "Title field is required"),
    email: z.string().email("Enter valid email address"),
    phone: z.string().min(10, "Phone Number field is too short"),
    department: z
      .string()
      .min(1, "Department field is required")
      .refine((val) => ["designer", "developer"].includes(val), {
        message: "Invalid department selected",
      }),
    status: z
      .string()
      .min(1, "Status field is required")
      .refine((val) => ["active", "inactive"].includes(val), {
        message: "Invalid status selected",
      }),
    slug: z.string(),
    avatar: z.any(),
    createdAt: z.string(),
  })
  .superRefine(async (data, ctx) => {
    const [checkEmail, checkPhone] = await Promise.all([
      axios.get(`http://localhost:5000/api/team-members/?email=${data.email}`),
      axios.get(`http://localhost:5000/api/team-members/?phone=${data.phone}`),
    ]);

    const existingEmail = checkEmail.data[0];
    const existingPhone = checkPhone.data[0];

    // email check
    if (existingEmail) {
      if (!data._id) {
        ctx.addIssue({
          code: "custom",
          message: "Email already exist",
          path: ["email"],
        });
      } else if (data._id !== existingEmail._id) {
        ctx.addIssue({
          code: "custom",
          message: "Email already exist",
          path: ["email"],
        });
      }
    }

    // phone check
    if (existingPhone) {
      if (!data._id) {
        ctx.addIssue({
          code: "custom",
          message: "Phone number already exist",
          path: ["phone"],
        });
      } else if (data._id !== existingPhone._id) {
        ctx.addIssue({
          code: "custom",
          message: "Phone number already exist",
          path: ["phone"],
        });
      }
    }
  });

type RowItem = z.infer<typeof TeamMembersSchema>;

export interface TableState {
  teamMembers: RowItem[];
  currentPage: number;
  selectedRows: string[];
  searchQuery: string;
  isOpenDeleteDialog: boolean;
  selectedItem: RowItem | null;
  isOpenDialogForm: boolean;
}

export type TableAction =
  | { type: "GET_ALL_TEAM_MEMBERS"; payload: RowItem[] }
  | { type: "OPEN_DELETE_DIALOG"; payload: RowItem }
  | { type: "CLOSE_DELETE_DIALOG" }
  | { type: "OPEN_DIALOG_FORM"; payload?: RowItem }
  | { type: "CLOSE_DIALOG_FORM" }
  | { type: "SET_SELECTED_ITEM"; payload: RowItem }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SELECTED_ROWS"; payload: string[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_ROW_SELECTION"; payload: { id: string; checked: boolean } }
  | {
      type: "SELECT_ALL";
      payload: { checked: boolean; currentData: RowItem[] };
    }
  | { type: "CLEAR_SELECTION" }
  | { type: "RESET_PAGE" };

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case "GET_ALL_TEAM_MEMBERS":
      return { ...state, teamMembers: action.payload };
    case "OPEN_DELETE_DIALOG":
      return {
        ...state,
        isOpenDeleteDialog: true,
        selectedItem: action.payload,
      };
    case "CLOSE_DELETE_DIALOG":
      return { ...state, isOpenDeleteDialog: false };

    case "OPEN_DIALOG_FORM":
      return {
        ...state,
        isOpenDialogForm: true,
        selectedItem: action.payload ? action.payload : null,
      };

    case "CLOSE_DIALOG_FORM":
      return { ...state, isOpenDialogForm: false };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_SELECTED_ROWS":
      return { ...state, selectedRows: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };

    case "TOGGLE_ROW_SELECTION": {
      const { id, checked } = action.payload;
      return {
        ...state,
        selectedRows: checked
          ? [...state.selectedRows, id]
          : state.selectedRows.filter((rowId) => rowId !== id),
      };
    }

    case "SELECT_ALL":
      return {
        ...state,
        selectedRows: action.payload.checked
          ? action.payload.currentData.map((item) => item._id)
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
  teamMembers: [],
  currentPage: 1,
  selectedRows: [],
  searchQuery: "",
  isOpenDeleteDialog: false,
  selectedItem: null,
  isOpenDialogForm: false,
};

interface DataTableProps {
  itemsPerPage?: number;
}

export default function TeamMembersTable({ itemsPerPage = 5 }: DataTableProps) {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  const { currentPage, selectedRows, searchQuery } = state;

  // **filteredData with newest first**
  const filteredData = state.teamMembers
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Get all Team Members
  const getTeamMembers = async () => {
    const res = await axios.get("http://localhost:5000/api/team-members/");
    dispatch({ type: "GET_ALL_TEAM_MEMBERS", payload: res.data });
  };
  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: totalPages || 1 });
    }
  }, [currentPage, totalPages]);
  
  useEffect(() => {
    getTeamMembers();
  }, []);

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: value });
  };

  const handleSelectAll = (checked: boolean) => {
    dispatch({ type: "SELECT_ALL", payload: { checked, currentData } });
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    dispatch({ type: "TOGGLE_ROW_SELECTION", payload: { id, checked } });
  };

  const isAllSelected =
    currentData.length > 0 &&
    currentData.every((item) => selectedRows.includes(item._id));

  const handleBulkDelete = () => {
    console.log("[v0] Bulk delete action for rows:", selectedRows);
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleBulkActivate = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleRowAction = (action: string, rowId: string) => {
    console.log(`Row action: ${action} for ${rowId}`);
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

        <div className="flex gap-2.5">
          {selectedRows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
          <Button
            onClick={() => {
              dispatch({ type: "OPEN_DIALOG_FORM" });
            }}
            variant="outline"
          >
            <Plus /> Add Member
          </Button>
        </div>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                  aria-label="Select all"
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
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
                    ? `No Team Member Found matching "${searchQuery}"`
                    : "No Team Member Found"}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, index) => (
                <TableRow
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-background" : "bg-card"
                  } hover:bg-muted/50 transition-colors`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item._id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item._id, checked === true)
                      }
                      aria-label={`Select ${item.title}`}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Image
                        className="w-[25px] h-[25px] object-cover rounded-[4px]"
                        src={item.avatar}
                        width={25}
                        height={25}
                        alt=""
                      />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {item.email}
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <span
                      className={`px-2 py-1 rounded-sm text-xs font-medium
                        ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status}
                    </span>
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
                        <DropdownMenuItem
                          onClick={() => {
                            dispatch({
                              type: "OPEN_DIALOG_FORM",
                              payload: item,
                            });
                          }}
                        >
                          <PencilLine /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            dispatch({
                              type: "OPEN_DELETE_DIALOG",
                              payload: item,
                            });
                          }}
                          className="text-red-500!"
                        >
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

      {/* // Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length > 0 && (
            <span>
              {selectedRows.length} of {filteredData.length} row(s) selected
            </span>
          )}
          {searchQuery && (
            <span className="ml-2">
              ({filteredData.length} of {state.teamMembers.length} rows shown)
            </span>
          )}
        </div>
        {state.teamMembers.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              dispatch({ type: "SET_CURRENT_PAGE", payload: page })
            }
          />
        )}
      </div>

      {/* Add or Edit dialog form  */}
      <TeamMemberForm
        refetch={getTeamMembers}
        state={state}
        dispatch={dispatch}
      />

      {/* Delete Dialog  */}
      <DeleteConfirmation
        refetch={getTeamMembers}
        state={state}
        dispatch={dispatch}
      />
    </>
  );
}
