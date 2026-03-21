"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Star, Settings, Users, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarNav() {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: "Apžvalga", icon: Building },
    { href: "/admin/nt-objektai", label: "NT Objektai", icon: Building },
    { href: "/admin/pasiulymai", label: "Komerciniai pasiūlymai", icon: FileText },
    { href: "/admin/blog", label: "Tinklaraštis", icon: FileText },
    { href: "/admin/atsiliepimai", label: "Atsiliepimai", icon: Star },
    { href: "/admin/crm", label: "CRM (Kontaktai)", icon: Users },
    { href: "/admin/naujienlaiskiai", label: "Naujienlaiškiai", icon: Mail },
    { href: "/admin/nustatymai", label: "Nustatymai", icon: Settings },
  ];

  return (
    <nav className="flex-1 space-y-2">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl font-medium transition-all border border-transparent",
              isActive 
                ? "bg-slate-50 text-[#2563EB] shadow-sm border-[#2563EB]/20" 
                : "text-slate-600 hover:bg-slate-50 hover:text-[#1E3A8A]"
            )}
          >
            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#2563EB]" : "text-slate-400")} /> 
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

