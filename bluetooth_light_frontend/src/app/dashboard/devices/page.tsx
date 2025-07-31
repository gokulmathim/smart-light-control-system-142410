"use client";
import { useAuth } from "../../../lib/authContext";
import React, { useEffect, useState, useCallback } from "react";
import { apiGet, apiPost, apiDelete } from "../../../lib/api";
import { FiPlus, FiTrash } from "react-icons/fi";

interface Device {
  id: string;
  name: string;
  address: string;
}

export default function DevicesPage() {
  const { token } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setDevices(await apiGet<Device[]>("/devices", token));
    } catch (e) {
      setMsg("Failed to load devices");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { refresh(); }, [token, refresh]);

  async function handlePair(e: React.FormEvent) {
    e.preventDefault();
    if (!addr || !name) return;
    setLoading(true);
    try {
      await apiPost("/devices", { address: addr, name }, token);
      setAddr(""); setName(""); setMsg("Device paired!");
      refresh();
    } catch {
      setMsg("Pairing failed");
    }
    setLoading(false);
  }

  async function handleRemove(id: string) {
    if (!window.confirm("Remove this device?")) return;
    setLoading(true);
    try {
      await apiDelete(`/devices/${id}`, token);
      setMsg("Device removed");
      refresh();
    } catch {
      setMsg("Remove failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-bold text-2xl mb-8">Your Devices</h1>
      <form className="flex gap-2 mb-6" onSubmit={handlePair}>
        <input
          className="border rounded px-3 py-2 w-1/2"
          placeholder="Bluetooth address"
          value={addr}
          onChange={e => setAddr(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 w-1/2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-secondary px-4 py-2 rounded font-bold hover:bg-accent/90"
        >
          <FiPlus />
        </button>
      </form>
      {msg && <div className="mb-2 text-primary">{msg}</div>}
      <div className="divide-y border rounded-lg bg-gray-50">
        {devices.length
          ? devices.map((d: Device) => (
              <div
                className="flex items-center justify-between px-4 py-3"
                key={d.id}
              >
                <span>
                  <span className="font-semibold">{d.name}</span>
                  <span className="ml-4 text-xs text-gray-500">{d.address}</span>
                </span>
                <span>
                  <button
                    onClick={() => handleRemove(d.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash />
                  </button>
                </span>
              </div>
            ))
          : (
            <div className="px-4 py-8 text-center text-gray-500">No paired devices.</div>
          )
        }
      </div>
    </div>
  );
}
