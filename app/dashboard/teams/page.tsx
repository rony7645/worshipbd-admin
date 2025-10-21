import SitebarHeader from "@/components/sitebar-header";
import TeamMembersTable from "@/components/team-members/table";

export const metadata = {
  title: "Team Members",
};


export default async function TeamMembersPage() {
  return (
    <>
      <SitebarHeader pageTitle={metadata.title} />
      <h2 className="page-heading my-6 text-lg font-semibold mt-10">Team Members</h2>
      <TeamMembersTable/>
    </>
  );
}
