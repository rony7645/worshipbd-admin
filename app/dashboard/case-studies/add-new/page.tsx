import CaseStudyForm from "@/components/case-studies/case-study-form"
import SitebarHeader from "@/components/sitebar-header"

export const metadata = {
    title: "Add New Case Study"
}
export default function AddCaseStudyPage () {
    return (
        <>
        <SitebarHeader pageTitle={metadata.title}/>
        <CaseStudyForm/>
        </>
    )
}