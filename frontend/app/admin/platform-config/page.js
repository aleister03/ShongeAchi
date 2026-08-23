"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="font-bold text-[#1a1a1a] mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:border-[#2a7a5a]"
        />
        {suffix && <span className="text-xs text-gray-400 w-16">{suffix}</span>}
      </span>
    </label>
  );
}

export default function PlatformConfigPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newArea, setNewArea] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/platform-config");
      setConfig(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function save(partial) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put("/api/platform-config", partial);
      setConfig(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function update(path, value) {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function addArea() {
    const area = newArea.trim();
    if (!area || config.supportedServiceAreas.includes(area)) return;
    update("supportedServiceAreas", [...config.supportedServiceAreas, area]);
    setNewArea("");
  }

  function removeArea(area) {
    update(
      "supportedServiceAreas",
      config.supportedServiceAreas.filter((a) => a !== area)
    );
  }

  if (loading || !config) {
    return (
      <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
        <AdminNavbar />
        <p className="px-10 py-10 text-gray-400 text-sm">Loading settings…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Platform Configuration</h1>
          {saved && <span className="text-sm text-[#2a7a5a] font-medium">Saved ✓</span>}
        </div>
        <p className="text-gray-500 mb-8">
          System-wide settings — changes here take effect immediately, with no code changes needed.
        </p>

        <Section
          title="Disaster Mode"
          description="While active, EVERY elder's missed-check-in escalation window is capped at the value below, overriding individual settings. Use during cyclone warnings or other emergencies to tighten monitoring platform-wide."
        >
          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700 font-medium">
              Disaster Mode is currently{" "}
              <span className={config.disasterMode.enabled ? "text-red-600" : "text-gray-400"}>
                {config.disasterMode.enabled ? "ACTIVE" : "off"}
              </span>
            </span>
            <button
              onClick={() => update("disasterMode.enabled", !config.disasterMode.enabled)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                config.disasterMode.enabled ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#e6f2dd] text-[#2a5a4a] hover:bg-[#d7ecc9]"
              }`}
            >
              {config.disasterMode.enabled ? "Deactivate" : "Activate Disaster Mode"}
            </button>
          </label>
          <NumberField
            label="Escalation window ceiling while active"
            value={config.disasterMode.reducedEscalateAfterHours}
            onChange={(v) => update("disasterMode.reducedEscalateAfterHours", v)}
            suffix="hours"
          />
          <NumberField
            label="Default escalation window (new elders)"
            value={config.defaultEscalateAfterHours}
            onChange={(v) => update("defaultEscalateAfterHours", v)}
            suffix="hours"
          />
        </Section>

        <Section
          title="Concern Score Thresholds"
          description="Where the AI-Powered Concern Metrics dashboard draws the Stable / Elevated / Critical lines."
        >
          <NumberField
            label="Elevated at or above"
            value={config.concernScoreThresholds.elevated}
            onChange={(v) => update("concernScoreThresholds.elevated", v)}
            suffix="%"
          />
          <NumberField
            label="Critical above"
            value={config.concernScoreThresholds.critical}
            onChange={(v) => update("concernScoreThresholds.critical", v)}
            suffix="%"
          />
        </Section>

        <Section title="Premium Pricing" description="Shown live on the public Pricing page.">
          <NumberField
            label="Monthly, per elder"
            value={config.premiumPricing.monthlyPerElder}
            onChange={(v) => update("premiumPricing.monthlyPerElder", v)}
            suffix="৳"
          />
          <NumberField
            label="Annual, per elder"
            value={config.premiumPricing.annualPerElder}
            onChange={(v) => update("premiumPricing.annualPerElder", v)}
            suffix="৳"
          />
        </Section>

        <Section
          title="Notifications"
          description="Controls whether the Escalation Engine records a 'Family Notified' step when it raises an escalation."
        >
          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Escalation notifications enabled</span>
            <input
              type="checkbox"
              checked={config.notificationRules.escalationNotificationsEnabled}
              onChange={(e) => update("notificationRules.escalationNotificationsEnabled", e.target.checked)}
              className="w-5 h-5 accent-[#2a7a5a]"
            />
          </label>
        </Section>

        <Section
          title="Supported Service Areas"
          description="Populates the area picker on the checker signup form."
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {config.supportedServiceAreas.map((area) => (
              <span key={area} className="flex items-center gap-2 bg-[#e6f2dd] text-[#2a5a4a] px-3 py-1.5 rounded-full text-sm">
                {area}
                <button onClick={() => removeArea(area)} className="text-[#2a5a4a]/60 hover:text-red-500 font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArea())}
              placeholder="Add a service area…"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#2a7a5a]"
            />
            <button onClick={addArea} className="px-5 py-2 rounded-full bg-[#e6f2dd] text-[#2a5a4a] text-sm font-medium hover:bg-[#d7ecc9] transition">
              Add
            </button>
          </div>
        </Section>

        <button
          onClick={() => save(config)}
          disabled={saving}
          className="px-8 py-3 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#215f49] transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save all settings"}
        </button>
      </div>
    </main>
  );
}