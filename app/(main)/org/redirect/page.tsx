import { redirect } from "next/navigation";
import { getUserOrgPath } from "@/lib/actions/auth";

export default async function RedirectPage() {
  const orgPath = await getUserOrgPath();

  if (orgPath) {
    redirect(orgPath);
  }
  
  redirect("/");
}