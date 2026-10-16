import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "StepForward — Learner support", description: "A calm, practical space for tracking learner progress and support." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
