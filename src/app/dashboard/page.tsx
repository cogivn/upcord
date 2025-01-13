import { DashboardContent } from "@/components/dashboard-content";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }
  return <DashboardContent />;
}
