import SitebarHeader from "@/components/sitebar-header";
import SubmissionTable from "@/components/submission/submission-table";
import { Images, PenLine, Users } from "lucide-react";

export const metadata = {
  title:"Dashboard"
}

export default function DashboardPage() {

  return (
    <>
    <SitebarHeader pageTitle={metadata.title}/>
      <main className="grid grid-cols-3 gap-5">
        <div className="flex flex-col border rounded-lg p-5 bg-white">
          <div className="flex justify-between">
            <h5>Team Member</h5>
            <Users className="text-muted-foreground" size={20} />
          </div>
          <h3 className="text-4xl font-medium mt-3">18</h3>
        </div>

        <div className="flex flex-col border rounded-lg p-5 bg-white">
          <div className="flex justify-between">
            <h5>Case Studies</h5>
            <Images className="text-muted-foreground" size={20} />
          </div>
          <h3 className="text-4xl font-medium mt-3">28</h3>
        </div>

        <div className="flex flex-col border rounded-lg p-5 bg-white">
          <div className="flex justify-between">
            <h5>Blog Posts</h5>
            <PenLine className="text-muted-foreground" size={20} />
          </div>
          <h3 className="text-4xl font-medium mt-3">150</h3>
        </div>
      </main>
      <h5 className="text-lg font-semibold mt-10">Our Submission Data</h5>
      <SubmissionTable />
    </>
  );
}
