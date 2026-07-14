// Start: Root Settings Route (redirect to consolidated hub)
import { redirect } from "next/navigation";

export default function SettingsRootPage() {
  redirect("/settings/pengguna");
}
// End: Root Settings Route