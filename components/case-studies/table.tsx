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
import { useCaseStudies } from "@/context/CaseStudiesContext";
import {
  MoreHorizontal,
  PencilLine,
  Plus,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import CaseStudyDeleteConfirmation from "./delete-confirmation";

interface DataTableProps {
  itemsPerPage?: number;
}

export default function CaseStudiesTable({ itemsPerPage = 5 }: DataTableProps) {
  const { state, dispatch } = useCaseStudies();
  const router = useRouter();
  const { currentPage, selectedRows, searchQuery } = state;

  // **filteredData with newest first**
  const filteredData = state.tableItems
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

  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: totalPages || 1 });
    }
  }, [currentPage, totalPages]);

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

  // const handleRowAction = (action: string, rowId: string) => {
  //   console.log(`Row action: ${action} for ${rowId}`);
  // };

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
          <Link href="/dashboard/case-studies/add-new">
            <Button variant="outline">
              <Plus /> Add Case Study
            </Button>
          </Link>
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
              <TableHead className="font-semibold">Categories</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
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
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <Image
                        className="w-[25px] h-[25px] object-cover rounded-[4px]"
                        src={item.featuredImg}
                        width={25}
                        height={25}
                        alt=""
                      />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.categories.map((category) => (
                      <Badge
                        className="mr-1"
                        key={category._id}
                        variant="outline"
                      >
                        {category.title}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) +
                      " - " +
                      new Date(item.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
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
                              type: "SET_SELECTED_ITEM",
                              payload: item,
                            });
                            router.push("/dashboard/case-studies/add-new");
                          }}
                        >
                          <PencilLine /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500!"
                          onClick={() => {
                            dispatch({
                              type: "OPEN_DELETE_DIALOG",
                              payload: item,
                            });
                          }}
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
              ({filteredData.length} of {state.tableItems.length} rows shown)
            </span>
          )}
        </div>
        {state.tableItems.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              dispatch({ type: "SET_CURRENT_PAGE", payload: page })
            }
          />
        )}

        <CaseStudyDeleteConfirmation />
      </div>
    </>
  );
}
