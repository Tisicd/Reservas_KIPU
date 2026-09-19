"use client";

import dynamic from "next/dynamic";

const GlobeThree = dynamic(() => import("./GlobeThree"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function Globe() {
  return (
    <div className="w-full h-full">
      <GlobeThree />
    </div>
  );
}
