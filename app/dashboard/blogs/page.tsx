import BlogsTable from "@/components/blogs/table";
import SitebarHeader from "@/components/sitebar-header";
export const metadata = {
  title: "Blogs",
};

export default function BlogPage() {
  return (
    <>
      <SitebarHeader pageTitle={metadata.title} />
      <h2 className="page-heading my-6 text-lg font-semibold mt-5">
        Blogs List
      </h2>
      <BlogsTable/>
    </>
  );
}
