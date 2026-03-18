import Link from "next/link";
import { Building, Star, Settings, LogOut, Users, FileText } from "lucide-react"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"

import SidebarNav from "./SidebarNav"
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    redirect("/prisijungimas")
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
  } catch (error) {
    redirect("/prisijungimas")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <AdminMobileNav />
      <aside className="hidden md:flex w-full md:w-64 bg-white border-r border-slate-200 p-6 flex-col">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1E3A8A] text-white">
            <Building className="w-6 h-6" />
          </Link>
          <p className="mt-4 font-bold text-[#111827] text-xl">Valdymo<br/>Skydelis</p>
        </div>
        
        <SidebarNav />

        <form method="POST" action="/api/auth/logout" className="mt-8 border-t border-slate-200 pt-6">

          <button type="submit" className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" /> Atsijungti
          </button>
        </form>
      </aside>
      
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
