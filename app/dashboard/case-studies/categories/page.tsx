import CaseStudiesCategoriesTable from "@/components/case-studies/categories/caseStudies-categories-table";
import SitebarHeader from "@/components/sitebar-header";
export const metadata = {
  title: "Case Studies Categories",
};
export default function CaseStudiesCategories() {
  return (
    <>
      <SitebarHeader pageTitle={metadata.title} />
      <CaseStudiesCategoriesTable />
    </>
  );
}
