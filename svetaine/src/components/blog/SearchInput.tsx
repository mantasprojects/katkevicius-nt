"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (!value) {
        current.delete("search");
      } else {
        current.set("search", value);
      }
      
      const search = current.toString();
      const query = search ? `?${search}` : "";
      
      router.push(`/naudinga-informacija${query}`, { scroll: false });
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [value, router, searchParams]);

  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-blue-300" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ieškoti straipsnių..."
        className="w-full h-14 pl-12 pr-12 bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 focus:border-white/40 text-white placeholder-blue-200/60 outline-none transition-all shadow-lg text-lg"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute inset-y-0 right-4 flex items-center text-blue-200 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
