import BlogsCategoriesTable from "@/components/blogs/categories/blog-categories-table";
import SitebarHeader from "@/components/sitebar-header";

export const metadata = {
  title: "Blogs Categories",
};

export default function BlogCategories() {
  return (
    <>
      <SitebarHeader pageTitle={metadata.title} />
      <BlogsCategoriesTable />
    </>
  );
}
