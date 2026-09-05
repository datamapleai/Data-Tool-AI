"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data) => {
        if (!data.installed) {
          router.push("/setup");
        } else {
          router.push("/resources");
        }
      })
      .catch(() => {
        router.push("/setup");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-canvas-text-dim">Loading...</div>
    </div>
  );
}
