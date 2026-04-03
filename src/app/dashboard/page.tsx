import { PipelineShell } from "@/components/dashboard/core/Pipelineshell";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/new");
}
