"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Plus, Pencil, Trash2, Check, X, Tag, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  color: string;
}

const PRESET_COLORS = [
  "#2563EB", "#059669", "#D97706", "#7C3AED",
  "#DC2626", "#EC4899", "#0891B2", "#4F46E5",
  "#CA8A04", "#16A34A", "#9333EA", "#E11D48",
  "#6B7280",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#2563EB");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blog/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Klaida gaunant kategorijas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [...prev, data.category]);
        setNewName("");
        setNewColor("#2563EB");
      }
    } catch (err) {
      console.error("Klaida kuriant kategoriją:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName, color: editColor }),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName, color: editColor } : c))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Klaida atnaujinant:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/blog/categories?id=${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Klaida trinant:", err);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Kraunamos kategorijos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog">
          <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
            <Tag className="w-8 h-8 text-[#2563EB]" />
            Kategorijos
          </h1>
          <p className="text-slate-500 mt-1">Kurkite ir valdykite tinklaraščio kategorijas</p>
        </div>
      </div>

      {/* Add New Category */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nauja kategorija
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Kategorijos pavadinimas..."
            className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-lg border border-slate-200">
              {PRESET_COLORS.slice(0, 6).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={`w-7 h-7 rounded-md transition-all cursor-pointer ${
                    newColor === color ? "ring-2 ring-offset-1 ring-slate-400 scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="relative">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 appearance-none"
                  title="Pasirinkti spalvą"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newName.trim() || saving}
            className="h-11 px-6 bg-[#2563EB] hover:bg-[#1d4ed8] font-bold rounded-xl shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Pridėti
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Visos kategorijos ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nėra kategorijų</p>
            <p className="text-slate-400 text-sm mt-1">Pridėkite pirmąją kategoriją aukščiau.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors group"
              >
                {editingId === cat.id ? (
                  /* Edit Mode */
                  <div className="flex items-center gap-3 flex-1 flex-wrap">
                    <div
                      className="w-5 h-5 rounded-full shrink-0 ring-2 ring-offset-1 ring-slate-200"
                      style={{ backgroundColor: editColor }}
                    />
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9 rounded-lg border-slate-200 flex-1 min-w-[180px]"
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                      autoFocus
                    />
                    <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-lg border border-slate-200">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditColor(color)}
                          className={`w-5 h-5 rounded transition-all cursor-pointer ${
                            editColor === color ? "ring-2 ring-offset-1 ring-slate-400 scale-110" : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={saving}
                        className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div
                      className="w-5 h-5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#111827] text-sm">{cat.name}</span>
                      <span className="text-xs text-slate-400 ml-3 font-mono">{cat.id}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(cat)}
                        className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#EFF6FF] text-slate-400 hover:text-[#2563EB] flex items-center justify-center transition-colors cursor-pointer"
                        title="Redaguoti"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirm === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                            title="Patvirtinti"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Atšaukti"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(cat.id)}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="Trinti"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
