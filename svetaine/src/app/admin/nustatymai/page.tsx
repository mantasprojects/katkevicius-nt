"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Users, Globe, Shield, Camera, Check, Trash2, LogOut, Sliders, Mail, Smartphone, MapPin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabType = "profilis" | "nariai" | "svetaine" | "saugumas";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profilis");
  const [settings, setSettings] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sRes = await fetch("/api/settings");
        const sData = await sRes.json();
        setSettings(sData);

        const mRes = await fetch("/api/team");
        const mData = await mRes.json();
        setMembers(mData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const tabs = [
    { id: "profilis" as TabType, label: "Profilis", icon: User },
    { id: "nariai" as TabType, label: "Komanda", icon: Users },
    { id: "svetaine" as TabType, label: "Svetainė", icon: Globe },
    { id: "saugumas" as TabType, label: "Saugumas", icon: Shield },
  ];

  return (
    <div className="space-y-8 max-w-6xl relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Nustatymai</h1>
          <p className="text-slate-500 mt-1">Profilio, komandos teisių ir saugumo valdymas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col gap-1">
            {tabs.map((tab) => {
              const IsActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                    IsActive 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", IsActive ? "text-white" : "text-slate-400")} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium">Kraunama...</div>
              ) : (
                <>
                  {activeTab === "profilis" && <ProfileTab settings={settings} setSettings={setSettings} />}
                  {activeTab === "nariai" && <MembersTab members={members} setMembers={setMembers} />}
                  {activeTab === "svetaine" && <WebsiteTab settings={settings} setSettings={setSettings} />}
                  {activeTab === "saugumas" && <SecurityTab />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// --- PROFILE TAB ---
// --- PROFILE TAB ---
function ProfileTab({ settings, setSettings }: { settings: any; setSettings: any }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!settings) return null;

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ text: "Prašome užpildyti visus laukus", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ text: "Slaptažodžiai nesutampa", type: "error" });
      return;
    }
    
    setIsSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: "Slaptažodis sėkmingai pakeistas!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg({ text: data.error || "Klaida keičiant slaptažodį", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Sistemos klaida", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMsg({ text: "Profilis išsaugotas!", type: "success" });
    } catch (err) {
      setMsg({ text: "Klaida išsaugant profilį", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[#111827] mb-1">Profilio Informacija</h3>
          <p className="text-xs text-slate-500">Atnaujinkite savo paskyros duomenis</p>
        </div>
        <Button onClick={handleSaveProfile} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-9 text-xs font-bold transition-all">
          Išsaugoti Profilį
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner overflow-hidden">
            <User className="w-10 h-10" />
          </div>
          <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{settings.profile?.name || "Mantas Katkevičius"}</h4>
          <p className="text-xs text-slate-500 mb-2">{settings.profile?.email || "mantas@pavyzdys.lt"}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
            Super Administratorius
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Vardas</label>
          <input 
            type="text" 
            value={settings.profile?.name || ""} 
            onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
            className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">El. Paštas</label>
          <input 
            type="email" 
            value={settings.profile?.email || ""} 
            onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
            className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" /> Keisti Slaptažodį
        </h4>
        
        {msg && (
          <div className={cn(
            "p-3 rounded-xl text-xs font-bold mb-4",
            msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
          )}>
            {msg.text}
          </div>
        )}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Dabartinis slaptažodis</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Naujas slaptažodis</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Pakartoti slaptažodį</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-primary" 
            />
          </div>
          <Button onClick={handlePasswordChange} disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6">
            {isSaving ? "Atnaujinama..." : "Atnaujinti Slaptažodį"}
          </Button>
        </div>
      </div>
    </div>
  );
}


// --- MEMBERS TAB ---
function MembersTab({ members, setMembers }: { members: any[]; setMembers: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [nName, setNName] = useState("");
  const [nEmail, setNEmail] = useState("");
  const [nRole, setNRole] = useState("Žiūrovas");

  const handleDelete = async (id: string) => {
    if (!confirm("Ar tikrai norite pašalinti šį narį?")) return;
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) {
        setMembers(members.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async () => {
    if (!nName || !nEmail) return alert("Užpildykite visus laukus");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "add", 
          member: { name: nName, email: nEmail, role: nRole, status: "Aktyvus" } 
        }),
      });
      if (res.ok) {
        setMembers([...members, { id: Date.now().toString(), name: nName, email: nEmail, role: nRole, status: "Aktyvus" }]);
        setIsAdding(false);
        setNName("");
        setNEmail("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[#111827] mb-1">Komandos nariai</h3>
          <p className="text-xs text-slate-500">Valdykite prieigos teises</p>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-9 text-xs font-bold">
          Pakviesti narį
        </Button>
      </div>

      {isAdding && (
        <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Vardas Pavardė</label>
            <input type="text" value={nName} onChange={(e) => setNName(e.target.value)} className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">El. Paštas</label>
            <input type="email" value={nEmail} onChange={(e) => setNEmail(e.target.value)} className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Rolė</label>
            <select value={nRole} onChange={(e) => setNRole(e.target.value)} className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm">
              <option value="Administratorius">Admin</option>
              <option value="Redaktorė">Redaktorius</option>
              <option value="Žiūrovas">Žiūrovas</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMember} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 h-8 text-xs font-bold w-full">Pridėti</Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="outline" className="rounded-lg h-8 text-xs px-3 w-full">Atšaukti</Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase">Vardas / El. paštas</th>
              <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase">Rolė</th>
              <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase">Statusas</th>
              <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {members.map((m, i) => (
              <tr key={m.id || i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                      {m.name ? m.name.split(' ').map((n: string) => n[0]).join('') : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn(
                    "inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border",
                    m.role === "Super Admin" || m.role === "Administratorius" ? "bg-purple-50 text-purple-700 border-purple-100" : m.role === "Redaktorė" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-50 text-slate-600 border-slate-100"
                  )}>
                    {m.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-bold",
                    m.status === "Aktyvus" ? "text-emerald-600" : "text-amber-500"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", m.status === "Aktyvus" ? "bg-emerald-500" : "bg-amber-500")} />
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {m.id !== "1" && (
                    <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- WEBSITE TAB ---
function WebsiteTab({ settings, setSettings }: { settings: any; setSettings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMsg({ text: "Nustatymai sėkmingai išsaugoti!", type: "success" });
      } else {
        setMsg({ text: "Nepavyko išsaugoti nustatymų", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Sistemos klaida", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMaintenance = () => {
    setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode });
  };

  if (!settings) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[#111827] mb-1">Tinklalapio Nustatymai</h3>
          <p className="text-xs text-slate-500">Bendrieji svetainės parametrai</p>
        </div>
        <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-9 text-xs font-bold transition-all">
          {isSaving ? "Saugojama..." : "Išsaugoti"}
        </Button>
      </div>

      {msg && (
        <div className={cn(
          "p-4 rounded-xl text-xs font-bold animate-in fade-in duration-300",
          msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {msg.text}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Priežiūros rėžimas</h4>
            <p className="text-xs text-amber-700">Lankytojai matys „Svetainė atnaujinama“ pranešimą.</p>
          </div>
        </div>
        <div className="shrink-0">
          <div 
            onClick={toggleMaintenance}
            className={cn(
              "w-11 h-6 rounded-full relative cursor-pointer flex items-center px-0.5 transition-colors duration-200",
              settings.maintenanceMode ? "bg-amber-500" : "bg-slate-200"
            )}
          >
            <div className={cn("w-5 h-5 bg-white rounded-full shadow-md transition-all", settings.maintenanceMode && "translate-x-5")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-800">Kontaktai Footerui</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase">Telefonas</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Smartphone className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={settings.footer?.phone || ""} 
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase">El. Paštas</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="email" 
                value={settings.footer?.email || ""} 
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
          <div className="relative md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Adresas</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={settings.footer?.address || ""} 
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, address: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-800">Socialiniai Tinklai</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Facebook Profilis</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Facebook className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={settings.socials?.facebook || ""} 
                onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Instagram Profilis</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Instagram className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={settings.socials?.instagram || ""} 
                onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase">LinkedIn Profilis</label>
            <div className="flex items-center mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Globe className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                value={settings.socials?.linkedin || ""} 
                onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, linkedin: e.target.value } })}
                className="w-full bg-transparent text-sm font-medium focus:outline-none" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- SECURITY TAB ---
function SecurityTab() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDisconnect = async (id: string) => {
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Klaida atjungiant sesiją");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnectOthers = async () => {
    if (!confirm("Ar tikrai norite atjungti visas kitas sesijas?")) return;
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_others" }),
      });
      if (res.ok) {
        setSessions(sessions.filter(s => s.current));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-[#111827] mb-1">Saugumas</h3>
        <p className="text-xs text-slate-500">Paskyros saugumo valdymas</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-800">Aktyvios sesijos</h4>
          <button onClick={handleDisconnectOthers} className="text-xs text-red-600 font-bold hover:underline">Atjungti kitas sesijas</button>
        </div>

        {isLoading ? (
          <div className="text-sm text-slate-400">Kraunamos sesijos...</div>
        ) : sessions.length === 0 ? (
          <div className="text-sm text-slate-400">Nėra aktyvių sesijų</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={s.id || i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {s.device} 
                      {s.current && <span className="inline-flex px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md">DABARTINĖ</span>}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">IP: {s.ip} • {s.location || "Lietuva"}</p>
                  </div>
                </div>
                {!s.current && (
                  <button onClick={() => handleDisconnect(s.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-2">Dvigubas Autentifikavimas (2FA)</h4>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Dviejų Žingsnių Patvirtinimas</p>
            <p className="text-xs text-slate-500 mt-0.5">Apsaugokite savo paskyrą papildomu kodo patikrinimu.</p>
          </div>
          <Button size="sm" className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold h-9">
            Įjungti
          </Button>
        </div>
      </div>
    </div>
  );
}
