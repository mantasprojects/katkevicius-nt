"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Turnstile from "@/components/ui/Turnstile"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [isLocalhost, setIsLocalhost] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setIsLocalhost(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, turnstileToken }),
      })

      if (res.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Neteisingi prisijungimo duomenys")
      }
    } catch (err) {
      setError("Įvyko sistemos klaida. Bandykite dar kartą.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 mb-6">
            <Building className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h1 className="text-3xl font-sans font-bold text-[#111827]">Prisijungimas</h1>
          <p className="text-slate-500 mt-2 font-medium">Administratoriaus valdymo aplinka</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#1E3A8A]/5 border border-slate-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] uppercase tracking-wider">Vartotojo Vardas</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Įveskite vartotojo vardą"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] uppercase tracking-wider">Slaptažodis</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Įveskite slaptažodį"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || (!turnstileToken && !isLocalhost)}
              className="w-full h-14 rounded-xl bg-[#1E3A8A] hover:bg-[#1e40af] text-white font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Prisijungti <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>

            <div className="flex justify-center mt-4">
              <Turnstile onVerify={setTurnstileToken} theme="light" />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-medium">Saugumo sumetimais ryšys yra šifruojamas</p>
        </div>

      </div>
    </div>
  )
}
