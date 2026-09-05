"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "@/app/components/button";
import { Modal } from "@/app/components/modal";
import { Checkbox, FormField, Input } from "@/app/components/form-fields";
import { H3 } from "@/app/components/typography";

type Color = { id: string; name: string; hexCode: string; isActive: boolean };
const blank = { name: "", hexCode: "#000000", isActive: true };

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]); const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<Color | null>(null); const [open, setOpen] = useState(false); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const load = async () => { const response = await fetch("/api/colors", { cache: "no-store" }); if (response.ok) setColors(await response.json()); else setError((await response.json()).error || "Unable to load colors."); };
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  const startCreate = () => { setEditing(null); setForm(blank); setError(""); setOpen(true); };
  const startEdit = (color: Color) => { setEditing(color); setForm({ name: color.name, hexCode: color.hexCode, isActive: color.isActive }); setError(""); setOpen(true); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setError(""); try { const response = await fetch(editing ? `/api/colors/${editing.id}` : "/api/colors", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setOpen(false); await load(); } catch (error) { setError(error instanceof Error ? error.message : "Unable to save color."); } finally { setSaving(false); } };
  const remove = async (color: Color) => { if (!confirm(`Delete ${color.name}?`)) return; const response = await fetch(`/api/colors/${color.id}`, { method: "DELETE" }); if (!response.ok) return setError((await response.json()).error || "Unable to delete color."); await load(); };
  return <div className="panel list-panel">
    <div className="page-header"><div><p className="eyebrow">Product Master</p><h1>Colors</h1></div><Button onClick={startCreate}><FiPlus /> Add Color</Button></div>
    {error && <p className="form-error">{error}</p>}
    <div className="divide-y divide-line">{colors.length ? colors.map((color) => <article key={color.id} className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><span className="h-8 w-8 rounded-full border border-black/15" style={{ backgroundColor: color.hexCode }} /><div><H3>{color.name}</H3><p className="text-sm text-black/60">{color.hexCode} · {color.isActive ? "Active" : "Inactive"}</p></div></div><div className="item-actions"><Button variant="unstyled" size="none" aria-label={`Edit ${color.name}`} onClick={() => startEdit(color)}><FiEdit2 size={16} /></Button><Button variant="unstyled" size="none" aria-label={`Delete ${color.name}`} onClick={() => void remove(color)}><FiTrash2 color="red" size={16} /></Button></div></article>) : <div className="surface-message">No colors yet.</div>}</div>
    <Modal open={open} title={editing ? "Edit Color" : "Add Color"} onClose={() => setOpen(false)}><form onSubmit={save} className="grid gap-4"><FormField label="Color name" required><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></FormField><FormField label="Hex color" required><div className="flex gap-3"><input type="color" value={form.hexCode} onChange={(event) => setForm({ ...form, hexCode: event.target.value.toUpperCase() })} className="h-12 w-14 cursor-pointer border border-line p-1" /><Input value={form.hexCode} onChange={(event) => setForm({ ...form, hexCode: event.target.value.toUpperCase() })} pattern="#[0-9A-Fa-f]{6}" required /></div></FormField><Checkbox label="Active" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />{error && <p className="form-error">{error}</p>}<div className="flex justify-end"><Button disabled={saving}>{saving ? "Saving..." : "Save Color"}</Button></div></form></Modal>
  </div>;
}
