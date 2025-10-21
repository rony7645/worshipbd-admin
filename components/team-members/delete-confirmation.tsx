"use client";

import { TableAction, TableState } from "@/components/team-members/table";
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

interface DeleteConfirmationProps {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  refetch: () => void
}
export default function DeleteConfirmation({
  refetch,
  state,
  dispatch,
}: DeleteConfirmationProps) {
  const handleItemDelete = async (slug: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/team-members/${slug}`);
      dispatch({ type: "CLOSE_DELETE_DIALOG" });
      toast.success("Deleted has been success");
      await refetch();
    } catch (error) {
        dispatch({ type: "CLOSE_DELETE_DIALOG" });
        toast.error('Something went wrong')
    }
  };

  return (
    <AlertDialog open={state.isOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete{" "}
            <strong>{state.selectedItem?.title}</strong> ? Once deleted, it cannot
            be recovered or undone permanently
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dispatch({ type: "CLOSE_DELETE_DIALOG" });
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if(state.selectedItem?.slug) {
                handleItemDelete(state.selectedItem.slug);
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
