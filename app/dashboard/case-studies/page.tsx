import CaseStudiesTable from "@/components/case-studies/table";
import SitebarHeader from "@/components/sitebar-header";
export const metadata = {
    title: "Case Studies"
}
export default function CaseStudiesPage () {
    return (
        <>
        <SitebarHeader pageTitle={metadata.title}/>
        <CaseStudiesTable/>
        </>
    )
}