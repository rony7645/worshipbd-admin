"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TableAction, TableState } from "./caseStudies-categories-table";

interface DeleteConfirmationProps {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  refetch: () => void;
}
export default function CaseStudiesCategoryDeleteConfirmation({
  refetch,
  state,
  dispatch,
}: DeleteConfirmationProps) {
  const handleItemDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/case-studies/categories/${id}`);
      dispatch({ type: "CLOSE_DELETE" });
      toast.success("Deleted has been success");
      await refetch();
    } catch (error) {
      dispatch({ type: "CLOSE_DELETE" });
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <AlertDialog open={state.isOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete{" "}
            <strong>{state.selectedItem?.title}</strong> ? Once deleted, it
            cannot be recovered or undone permanently
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dispatch({ type: "CLOSE_DELETE" });
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (state.selectedItem?._id) {
                handleItemDelete(state.selectedItem._id);
              }
            }}
            className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <Trash2 />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
