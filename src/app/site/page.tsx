// Start: Site Index Redirect (Rule 31 Brand Consistency)
// Plain "/site" is not a valid route — the real path is "/site/[username]".
// Redirect visitors to the landing page instead of surfacing a 404.
import { redirect } from "next/navigation";

export default function SiteIndexPage() {
  redirect("/");
}
// End: Site Index Redirect