"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2 } from "lucide-react";
import SidebarNav from "@/app/admin/SidebarNav";
import { Button } from "@/components/ui/button";

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/admin" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-lg text-[#111827] tracking-tight">Valdymo Skydelis</span>
      </Link>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-slate-600 rounded-lg hover:bg-slate-50 h-10 w-10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Slide-out Menu */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div onClick={() => setIsOpen(false)}>
            <SidebarNav />
          </div>
        </div>
      )}
    </div>
  );
}
