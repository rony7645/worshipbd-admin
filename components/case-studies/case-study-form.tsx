"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  useCaseStudies,
  ZodCaseStudySchema,
} from "@/context/CaseStudiesContext";
import api from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type CaseStudyData = z.infer<typeof ZodCaseStudySchema>;

interface Categories {
  _id: string;
  title: string;
}

export default function CaseStudyForm() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { state, dispatch, getTableItems: refetch } = useCaseStudies();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CaseStudyData>({
    resolver: zodResolver(ZodCaseStudySchema),
    defaultValues: {
      _id: "",
      title: "",
      description: "",
      categories: [],
      status: "",
      featuredImg: null,
      createdAt: "",
    },
  });

  // Fetch categories
  const formCategories = async () => {
    try {
      const res = await api.get("/api/case-studies/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    formCategories();
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  // Populate form in Edit mode
  useEffect(() => {
    if (state.selectedItem) {
      reset({
        _id: state.selectedItem._id,
        title: state.selectedItem.title,
        description: state.selectedItem.description,
        categories: state.selectedItem.categories || [],
        status: state.selectedItem.status,
        featuredImg: null,
        createdAt: state.selectedItem.createdAt,
      });

      if (state.selectedItem.featuredImg) {
        setImagePreview(state.selectedItem.featuredImg); // backend url
      }
    }
  }, [state.selectedItem, reset]);

  // Submit handler (Create / Update)
  const onSubmit = async (data: CaseStudyData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);

      data.categories.forEach((cat) =>
        formData.append("categories[]", cat._id)
      );

      if (data.featuredImg) {
        formData.append("featuredImg", data.featuredImg);
      }

      if (data._id) {
        // Update
        await api.patch(`/api/case-studies/${data._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Case Study updated successfully!");
      } else {
        // Create
        await api.post("/api/case-studies/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Case Study created successfully!");
      }

      reset();
      setImagePreview(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-xl font-semibold">
          {state.selectedItem ? "Edit Case Study" : "Create Case Study"}
        </h1>
      </div>

      <div className="blog-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-14">
            {/* Main Form */}
            <div className="w-3/4">
              <div className="grid gap-8">
                {/* Title */}
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" type="text" {...register("title")} />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="grid gap-3">
                  <Label htmlFor="content">Description</Label>
                  <Textarea
                    id="content"
                    className="h-60"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <Button type="submit" className="w-full sm:w-auto">
                    {state.selectedItem ? "Update" : "Publish"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-1/4 grid gap-8">
              {/* Categories */}
              <div className="grid gap-3">
                <Label className="mb-1">Categories</Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {categories.map((item) => {
                        const isChecked = field.value?.some(
                          (v) => v._id === item._id
                        );
                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={item._id}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (v) => v._id !== item._id
                                      )
                                    )
                              }
                            />
                            <Label htmlFor={item._id} className="font-normal">
                              {item.title}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.categories && (
                  <p className="text-sm text-red-500">
                    {errors.categories.message as string}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="grid gap-3">
                <Label>Select Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
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
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              <div className="grid gap-3">
                <Label>Featured Image</Label>
                <Controller
                  name="featuredImg"
                  control={control}
                  render={({ field }) => {
                    const handleImageChange = (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    };

                    const handleRemove = () => {
                      field.onChange(null);
                      setImagePreview(null);
                      const input = document.getElementById(
                        "featured-image"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    };

                    return (
                      <div className="space-y-4">
                        {imagePreview ? (
                          <div className="relative">
                            <Image
                              src={imagePreview}
                              alt="Featured image preview"
                              width={100}
                              height={32}
                              className="w-full h-32 object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={handleRemove}
                            >
                              <X />
                            </Button>
                          </div>
                        ) : (
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="featured-image" className="sr-only">
                              Featured Image
                            </Label>
                            <div className="relative">
                              <Input
                                id="featured-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full h-32 border-dashed border-2 hover:bg-muted/50 bg-transparent"
                                onClick={() =>
                                  document
                                    .getElementById("featured-image")
                                    ?.click()
                                }
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Upload Image
                                  </span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
