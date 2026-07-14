// Start: Custom Domain Route (redirects into consolidated SettingsHub tab)
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SettingsHub from "@/components/SettingsHub";

export default function CustomDomainRedirect({ params }: { params: { username: string } }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/settings/${params.username}?tab=custom_domain`);
  }, [router, params.username]);
  return <SettingsHub username={params.username} />;
}
// End: Custom Domain Route