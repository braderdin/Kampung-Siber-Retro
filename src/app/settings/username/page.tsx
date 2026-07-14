// Start: Username Settings Route (consolidated into SettingsHub)
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SettingsHub from "@/components/SettingsHub";

export default function UsernameSettingsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/pengguna");
  }, [router]);
  return <SettingsHub username="pengguna" />;
}
// End: Username Settings Route