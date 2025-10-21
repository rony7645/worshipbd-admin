"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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

// ✅ Zod Schema
export const ZodBlogSchema = z.object({
  _id: z.string(),
  title: z.string().min(1, "This field is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "This field is required"),
  status: z.string().min(1, "This field is required"),
  featuredImg: z.instanceof(File).nullable(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  createdAt: z.string()
});

type BlogData = z.infer<typeof ZodBlogSchema>;

interface Categories {
  _id: string;
  title: string;
}

export default function BlogDataForm() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BlogData>({
    resolver: zodResolver(ZodBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      categories: [],
      status: "",
      featuredImg: null,
    },
  });

  // ✅ Fetch categories
  const formCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    formCategories();
  }, []);

  // ✅ Clean up object URLs to avoid memory leaks
  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  // ✅ Form submit
  const onSubmit = async (data: BlogData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);

      data.categories.forEach((cat) => formData.append("categories[]", cat));
      if (data.featuredImg) {
        formData.append("featuredImg", data.featuredImg);
      }

      await axios.post("http://localhost:5000/api/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog created successfully!");

      reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
      </div>

      <div className="blog-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-5">
            {/* Main Form */}
            <div className="w-3/4 grid gap-6 rounded px-5 py-5 bg-white">
              {/* Title */}
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your blog post title..."
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-3">
                <Label htmlFor="content">Description</Label>
                <Textarea
                  placeholder="Write your blog post content here..."
                  id="content"
                  className="h-40"
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
                  Publish Post
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-1/4 grid gap-5">
              {/* Categories Section */}
              <div className="grid gap-3 rounded px-5 py-5 bg-white">
                <Label className="mb-1">Categories</Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {categories.map((item) => {
                        const isChecked = field.value?.includes(item._id);

                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={item._id}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item._id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item._id
                                      )
                                    );
                              }}
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

              {/* Status Field */}
              <div className="grid gap-3 rounded px-5 py-5 bg-white">
                <Label>Select Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
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

              {/* Featured Image Section */}
              <div className="grid gap-3 rounded px-5 py-5 bg-white">
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
                        field.onChange(file); // save file in form
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
