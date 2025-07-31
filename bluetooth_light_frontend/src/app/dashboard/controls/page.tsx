"use client";
import { useAuth } from "../../../lib/authContext";
import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../../lib/api";
import { FiSun, FiToggleLeft, FiToggleRight } from "react-icons/fi";

interface Device {
  id: string;
  name: string;
  address: string;
}
interface LightStatus {
  on: boolean;
  color: string;
  brightness: number;
  [key: string]: unknown;
}

export default function ControlsPage() {
  const { token } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [status, setStatus] = useState<LightStatus | null>(null);
  const [color, setColor] = useState("#ffffff");
  const [brightness, setBrightness] = useState(100);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<Device[]>("/devices", token).then(ds => {
      setDevices(ds);
      if (ds.length && !deviceId) setDeviceId(ds[0].id);
    });
  }, [token, deviceId]);

  useEffect(() => {
    if (!token || !deviceId) return;
    apiGet<LightStatus>(`/light/${deviceId}/status`, token).then(st => {
      setStatus(st);
      setColor(st.color || "#ffffff");
      setBrightness(st.brightness ?? 100);
    });
  }, [token, deviceId]);

  async function setLight(on: boolean) {
    if (!deviceId) return;
    setErr(null);
    try {
      await apiPost(`/light/${deviceId}/${on ? "on" : "off"}`, {}, token);
      setStatus(s => (s ? { ...s, on } : { on, color, brightness }));
    } catch {
      setErr("Failed to toggle light");
    }
  }
  
  async function submitColor(c: string) {
    if (!deviceId) return;
    try {
      await apiPost(`/light/${deviceId}/color`, { color: c }, token);
      setColor(c);
      setStatus((s: LightStatus | null) => (s ? { ...s, color: c } : null));
    } catch { setErr("Color change failed"); }
  }

  async function submitBrightness(val: number) {
    if (!deviceId) return;
    try {
      await apiPost(`/light/${deviceId}/brightness`, { brightness: val }, token);
      setStatus((s) => (s ? { ...s, brightness: val } : null));
    } catch { setErr("Failed to set brightness"); }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-bold text-2xl mb-8">Live Controls</h1>
      {devices.length > 0 ? (
        <>
          <div className="mb-4">
            <select
              className="border rounded px-3 py-2 w-full"
              value={deviceId || ""}
              onChange={e => setDeviceId(e.target.value)}
            >
              {devices.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm mt-2 text-gray-600">
              <FiSun /> {status && status.on ? "On" : "Off"}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md ${status && status.on ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {status && status.on ? <FiToggleRight /> : <FiToggleLeft />}
              </span>
              <button
                disabled={status && status.on}
                className="ml-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-60"
                onClick={() => setLight(true)}
              >
                Turn On
              </button>
              <button
                disabled={status && !status.on}
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-60"
                onClick={() => setLight(false)}
              >
                Turn Off
              </button>
            </div>
          </div>
          <div className="mt-8 mb-8 flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold">Color</label>
              <input
                type="color"
                value={color}
                onChange={e => submitColor(e.target.value)}
                className="w-16 h-10 p-1 border bg-white rounded"
                aria-label="Color Picker"
              />
              <span className="ml-4">{color}</span>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">
                Brightness
                <span className="ml-2 font-normal text-xs">({brightness}%)</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={brightness}
                onChange={e => {
                  setBrightness(Number(e.target.value));
                  submitBrightness(Number(e.target.value));
                }}
                className="w-1/2"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-gray-500">No devices found. Pair a device to control.</div>
      )}
      {err && <div className="text-red-600 mt-2">{err}</div>}
    </div>
  );
}
