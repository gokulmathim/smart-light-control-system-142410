"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/authContext";
import { apiGet, apiPost, apiDelete } from "../../../lib/api";
import { FiPlus, FiTrash } from "react-icons/fi";

interface Routine {
  id: string;
  description: string;
  hour: number;
}

export default function RoutinesPage() {
  const { token } = useAuth();
  const [list, setList] = useState<Routine[]>([]);
  const [desc, setDesc] = useState("");
  const [hour, setHour] = useState(8);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!token) return;
    apiGet<Routine[]>("/routines", token)
      .then(setList)
      .catch(() => setMsg("Failed to load"));
  }, [token]);

  useEffect(() => { refresh(); }, [token, refresh]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/routines", { description: desc, hour }, token);
      setDesc(""); setHour(8); setMsg("Routine added!");
      refresh();
    } catch { setMsg("Add failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this routine?")) return;
    try {
      await apiDelete(`/routines/${id}`, token); setMsg("Deleted");
      refresh();
    } catch { setMsg("Delete failed"); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-bold text-2xl mb-8">Schedules & Routines</h1>
      <form className="flex gap-2 mb-4" onSubmit={handleAdd}>
        <input
          className="border rounded px-3 py-2 w-2/3"
          placeholder="Description (e.g. Turn on at 8am)"
          required
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-1/3"
          type="number"
          min={0} max={23}
          value={hour}
          onChange={e => setHour(Number(e.target.value))}
        />
        <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary/90">
          <FiPlus />
        </button>
      </form>
      {msg && <div className="mb-2 text-primary">{msg}</div>}
      <div className="divide-y border rounded-lg bg-gray-50">
        {list.length ? list.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <span>
              <span className="font-semibold">{r.description}</span>
              <span className="ml-4 text-xs text-gray-500">Hour: {r.hour}</span>
            </span>
            <button onClick={() => handleDelete(r.id)}
              className="text-red-500 hover:text-red-600"><FiTrash /></button>
          </div>
        )) : (
          <div className="px-4 py-8 text-center text-gray-500">No routines added.</div>
        )}
      </div>
    </div>
  );
}
