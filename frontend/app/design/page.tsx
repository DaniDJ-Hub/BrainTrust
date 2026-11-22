import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DesignShowcase } from "./_components/design-showcase"

export const metadata: Metadata = {
  title: "Design system · BrainTrust",
  robots: { index: false, follow: false },
}

export default function DesignPage() {
  if (process.env.VERCEL_ENV === "production") notFound()

  return <DesignShowcase />
}
