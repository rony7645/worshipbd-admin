"use client";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { useCallback, useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BlogsCategoryDeleteConfirmation from "./delete-confirmation";

//Schema
const ZodBlogsCategoriesSchemas = z.object({
  _id: z.string(),
  title: z.string().min(1, "This field is required"),
  createdAt: z.string(),
});

type RowItem = z.infer<typeof ZodBlogsCategoriesSchemas>;

//Table State
export interface TableState {
  tableItems: RowItem[];
  currentPage: number;
  isOpenDeleteDialog: boolean;
  selectedItem: RowItem | null;
}

//Reducer Actions
export type TableAction =
  | { type: "SET_ITEMS"; payload: RowItem[] }
  | { type: "OPEN_DELETE"; payload: RowItem }
  | { type: "CLOSE_DELETE" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_EDIT"; payload: RowItem }
  | { type: "CANCEL_EDIT" };

//Reducer
const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, tableItems: action.payload };

    case "OPEN_DELETE":
      return {
        ...state,
        isOpenDeleteDialog: true,
        selectedItem: action.payload,
      };

    case "CLOSE_DELETE":
      return { ...state, isOpenDeleteDialog: false, selectedItem: null };

    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_EDIT":
      return { ...state, selectedItem: action.payload };

    case "CANCEL_EDIT":
      return { ...state, selectedItem: null };

    default:
      return state;
  }
};

// Initial State
const initialState: TableState = {
  tableItems: [],
  currentPage: 1,
  isOpenDeleteDialog: false,
  selectedItem: null,
};

// Component
interface DataTableProps {
  itemsPerPage?: number;
}

export default function BlogsCategoriesTable({
  itemsPerPage = 5,
}: DataTableProps) {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  const { tableItems, currentPage } = state;

  // filtered data (sorted by newest)
  const filteredData = tableItems
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // fetch items
  const getTableItems = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/blogs/categories");
    dispatch({ type: "SET_ITEMS", payload: res.data });
  }, []);

  useEffect(() => {
    getTableItems();
  }, [getTableItems]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RowItem>({
    resolver: zodResolver(ZodBlogsCategoriesSchemas),
    defaultValues: {
      _id: "",
      title: "",
      createdAt: "",
    },
  });

  const onSubmit = async (data: RowItem) => {
    try {
      if (state.selectedItem) {
        await axios.patch(
          `http://localhost:5000/api/blogs/categories/${data._id}`,
          data
        );
        toast.success("Category updated success");
        dispatch({type: "CANCEL_EDIT"})
      } else {
        await axios.post("http://localhost:5000/api/blogs/categories", data);
        toast.success("Category created success");
      }
      getTableItems();
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // form edit or add new condition
  useEffect(() => {
    if (state.selectedItem && !state.isOpenDeleteDialog) {
      reset({
        _id: state.selectedItem._id,
        title: state.selectedItem.title,
        createdAt: state.selectedItem.createdAt,
      });
    } else {
      reset({
        _id: "",
        title: "",
        createdAt: "",
      });
    }
  }, [state.selectedItem, reset]);

  return (
    <>
      <div className="flex gap-6 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-md px-5 py-6 border">
            <h2 className="text-[20px] font-semibold mb-5">
              {state.selectedItem && !state.isOpenDeleteDialog
                ? "Edit"
                : "Add New"}{" "}
              Category
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <Label htmlFor="title">Category Title</Label>
                <Input id="title" type="text" {...register("title")} />
                {errors.title && (
                  <p className="text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="mt-5">
                  {state.selectedItem && !state.isOpenDeleteDialog
                    ? "Update"
                    : "Add"}
                </Button>
                {state.selectedItem && !state.isOpenDeleteDialog && (
                  <Button
                    className="mt-5"
                    variant="outline"
                    onClick={() => {
                      dispatch({ type: "CANCEL_EDIT" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="w-full lg:w-2/3 bg-white border rounded-md px-5 py-6">
          <h2 className="text-[20px] font-semibold mb-5">Categories List</h2>
          {/* Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white hover:bg-muted">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No Team Member Found
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
                      <TableCell className="text-foreground">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) +
                          " - " +
                          new Date(item.createdAt).toLocaleDateString("en-GB")}
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
                                dispatch({ type: "SET_EDIT", payload: item });
                              }}
                            >
                              <PencilLine /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="!text-red-500 "
                              onClick={() =>
                                dispatch({ type: "OPEN_DELETE", payload: item })
                              }
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

          {/* Pagination */}
          {tableItems.length > itemsPerPage && (
            <div className="flex items-center justify-end py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) =>
                  dispatch({ type: "SET_PAGE", payload: page })
                }
              />
            </div>
          )}
        </div>
      </div>

      <BlogsCategoryDeleteConfirmation
        state={state}
        dispatch={dispatch}
        refetch={getTableItems}
      />
    </>
  );
}
