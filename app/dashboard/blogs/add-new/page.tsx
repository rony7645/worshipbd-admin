// import * as React from "react";

import BlogDataForm from "@/components/blogs/blog-form";
import SitebarHeader from "@/components/sitebar-header";


// const programmingLanguages = [
//   { value: "javascript", label: "JavaScript" },
//   { value: "typescript", label: "TypeScript" },
//   { value: "python", label: "Python" },
//   { value: "java", label: "Java" },
//   { value: "csharp", label: "C#" },
//   { value: "php", label: "PHP" },
//   { value: "ruby", label: "Ruby" },
//   { value: "go", label: "Go" },
//   { value: "rust", label: "Rust" },
//   { value: "swift", label: "Swift" },
//   { value: "kotlin", label: "Kotlin" },
//   { value: "cpp", label: "C++" },
//   { value: "c", label: "C" },
//   { value: "scala", label: "Scala" },
// ];

export const metadata = {
  title: "Add new blog"
}
export default function BlogForm() {
  //   const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
  //     []
  //   );
  //   const [featuredImage, setFeaturedImage] = React.useState<File | null>(null);
  //   const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  //   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     if (file) {
  //       setFeaturedImage(file);
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         setImagePreview(e.target?.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleSubmit = (event: React.FormEvent) => {
  //     event.preventDefault();
  //     console.log("Form submitted with categories:", selectedCategories);
  //     console.log("Featured image:", featuredImage);
  //   };

  return <>
  <SitebarHeader pageTitle={metadata.title}/>
  <BlogDataForm/>
  </>;
}
