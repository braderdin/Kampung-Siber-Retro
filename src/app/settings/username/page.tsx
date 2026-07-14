// Start: Username Settings Route (consolidated into SettingsHub)
"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import SettingsHub from "@/components/SettingsHub";

export default function UsernameSettingsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/pengguna");
  }, [router]);
  // Start: Suspense boundary for useSearchParams CSR bailout fix
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814]" />}>
      <SettingsHub username="pengguna" />
    </Suspense>
  );
  // End: Suspense boundary for useSearchParams CSR bailout fix
}
// End: Username Settings Route
