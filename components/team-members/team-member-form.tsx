"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TableAction, TableState, TeamMembersSchema } from "./table";

type FormData = z.infer<typeof TeamMembersSchema>;

type TeamMemberForm = {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  refetch: () => void;
};

export default function TeamMemberForm({
  refetch,
  state,
  dispatch,
}: TeamMemberForm) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(TeamMembersSchema),
    defaultValues: {
      _id: "",
      title: "",
      slug: "",
      department: "",
      status: "active",
      avatar: undefined,
      createdAt: "",
    },
  });
  console.log(errors);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("department", data.department);
      formData.append("status", data.status);
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      if (!state.selectedItem) {
        await api.post("/api/team-members/", formData);
        toast.success("Team member added successfully");
      } else {
        await api.patch(`/api/team-members/${data.slug}`, formData);
        toast.success("Team member updated successfully");
      }

      dispatch({ type: "CLOSE_DIALOG_FORM" });
      reset();
      await refetch();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const fieldErrors = (fieldName: keyof FormData) => {
    if (errors[fieldName]) {
      return "focus-visible:ring-destructive/40 border-destructive";
    }
  };
  console.log(errors);

  useEffect(() => {
    if (state.selectedItem) {
      reset({
        title: state.selectedItem.title,
        email: state.selectedItem.email,
        phone: state.selectedItem.phone,
        department: state.selectedItem.department,
        status: state.selectedItem.status,
        createdAt: state.selectedItem.createdAt,
        _id: state.selectedItem._id,
        slug: state.selectedItem.slug,
        avatar: undefined,
      });
    } else {
      reset({
        _id: "",
        title: "",
        slug: "",
        department: "",
        status: "active",
        avatar: undefined,
        createdAt: "",
      });
    }
  }, [state.selectedItem, reset]);

  return (
    <Dialog
      open={state.isOpenDialogForm}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch({ type: "CLOSE_DIALOG_FORM" });
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              {state.selectedItem ? "Edit Information" : "Add New Member"}
            </DialogTitle>
            <DialogDescription>
              Fill out the member details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("title")}
                className={`${fieldErrors("title")}`}
              />
              {errors.title && (
                <p className="text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
                className={`${fieldErrors("email")}`}
              />
              {errors.email && (
                <p className="text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone"
                {...register("phone")}
                className={`${fieldErrors("phone")}`}
              />
              {errors.phone && (
                <p className="text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* department  */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className={`${fieldErrors("department")} w-full py-5`}
                    >
                      <SelectValue placeholder="Select a Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && (
                <p className="text-destructive">{errors.department.message}</p>
              )}
            </div>

            {/* status  */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className={`${fieldErrors("status")} w-full py-5`}
                    >
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-destructive">{errors.status.message}</p>
              )}
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Team Member Image</Label>
              <Input id="avatar" type="file" {...register("avatar")} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  dispatch({ type: "CLOSE_DIALOG_FORM" });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {state.selectedItem ? "Update" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
