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
import { useCaseStudies } from "@/context/CaseStudiesContext";
import api from "@/hooks/useAxios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CaseStudyDeleteConfirmation() {
  const { state, dispatch, getTableItems: refetch } = useCaseStudies();
  const handleItemDelete = async (id: string) => {
    try {
      await api.delete(`/api/case-studies/${id}`);
      dispatch({ type: "CLOSE_DELETE_DIALOG" });
      toast.success("Deleted has been success");
      await refetch();
    } catch (error) {
      dispatch({ type: "CLOSE_DELETE_DIALOG" });
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
              dispatch({ type: "CLOSE_DELETE_DIALOG" });
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
