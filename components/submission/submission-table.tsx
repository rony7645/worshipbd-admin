import { DataTable } from "@/components/data-table"
const sampleData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-01-17",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
    createdAt: "2024-01-18",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-01-19",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana@example.com",
    role: "Admin",
    status: "Inactive",
    createdAt: "2024-01-20",
  },
  {
    id: "7",
    name: "Edward Miller",
    email: "edward@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-01-21",
  },
  {
    id: "8",
    name: "Fiona Garcia",
    email: "fiona@example.com",
    role: "Moderator",
    status: "Active",
    createdAt: "2024-01-22",
  },
  {
    id: "9",
    name: "George Martinez",
    email: "george@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-01-23",
  },
  {
    id: "10",
    name: "Helen Rodriguez",
    email: "helen@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-24",
  },
  {
    id: "11",
    name: "Ian Thompson",
    email: "ian@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-01-25",
  },
  {
    id: "12",
    name: "Julia Anderson",
    email: "julia@example.com",
    role: "Moderator",
    status: "Inactive",
    createdAt: "2024-01-26",
  },
]

export default function SubmissionTable() {
  return (
    <>
    <DataTable data={sampleData} />
    </>
  );
}
