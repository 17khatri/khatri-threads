"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "@/app/components/button";
import { Modal } from "@/app/components/modal";
import { FormField, Input } from "@/app/components/form-fields";
import { H2, H3, P } from "@/app/components/typography";

type Collection = { id: string; name: string };

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]); const [name, setName] = useState(""); const [editing, setEditing] = useState<Collection | null>(null); const [open, setOpen] = useState(false); const [error, setError] = useState("");
  const load = async () => { const response = await fetch("/api/collections", { cache: "no-store" }); if (response.ok) setCollections(await response.json()); };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const save = async (event: React.FormEvent) => { event.preventDefault(); setError(""); const response = await fetch(editing ? `/api/collections/${editing.id}` : "/api/collections", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }); const data = await response.json(); if (!response.ok) return setError(data.error); setOpen(false); setName(""); setEditing(null); void load(); };
  const remove = async (id: string) => { if (!confirm("Delete this collection?")) return; const response = await fetch(`/api/collections/${id}`, { method: "DELETE" }); if (!response.ok) return setError((await response.json()).error); void load(); };
  return <div className="panel list-panel"><div className="panel-heading"><div><H2 className="mb-2">Collections</H2><P>Manage optional groups for your products.</P></div><Button onClick={() => { setEditing(null); setName(""); setError(""); setOpen(true); }}><FiPlus /> Add Collection</Button></div>{error && <p className="form-error">{error}</p>}<div className="category-list">{collections.length ? collections.map((collection) => <article key={collection.id} className="flex items-center justify-between gap-4 rounded-lg border border-line p-4"><H3>{collection.name}</H3><div className="item-actions shrink-0"><button aria-label={`Edit ${collection.name}`} onClick={() => { setEditing(collection); setName(collection.name); setError(""); setOpen(true); }}><FiEdit2 size={16} /></button><button aria-label={`Delete ${collection.name}`} onClick={() => void remove(collection.id)}><FiTrash2 color="red" size={16} /></button></div></article>) : <div className="surface-message">No collections found.</div>}</div><Modal open={open} title={editing ? "Edit Collection" : "Add Collection"} onClose={() => setOpen(false)}><form onSubmit={save} className="flex flex-col gap-3"><FormField label="Collection Name" required><Input value={name} onChange={(event) => setName(event.target.value)} required /></FormField>{error && <p className="form-error">{error}</p>}<div className="flex justify-end"><Button disabled={!name.trim()}>{editing ? "Update" : "Create"}</Button></div></form></Modal></div>;
}
