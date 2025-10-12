"use client"

import { Toaster } from "@/app/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
