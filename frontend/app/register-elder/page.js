"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DAYS = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
const DAY_FULL = {
  SAT: "Saturday", SUN: "Sunday", MON: "Monday",
  TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday"
};

export default function RegisterElder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef();

  // Step 1
  const [form1, setForm1] = useState({
    name: "", phone: "", age: "", gender: "", address: "", bio: ""
  });

  // Step 2
  const [conditions, setConditions] = useState([]);
  const [conditionInput, setConditionInput] = useState("");
  const [mobilityNotes, setMobilityNotes] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [escalateHours, setEscalateHours] = useState(4);

  // Step 3
  const [primary, setPrimary] = useState({ name: "", phone: "", relationship: "", note: "" });
  const [secondary, setSecondary] = useState({ name: "", phone: "", relationship: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  function toggleDay(day) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  function addCondition(e) {
    if (e.key === "Enter" && conditionInput.trim()) {
      if (!conditions.includes(conditionInput.trim())) {
        setConditions([...conditions, conditionInput.trim()]);
      }
      setConditionInput("");
    }
  }

  function removeCondition(c) {
    setConditions(conditions.filter(x => x !== c));
  }

  function validateStep1() {
    if (!form1.name || !form1.phone || !form1.age || !form1.gender || !form1.address) {
      setError("Please fill in all required fields.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep2() {
    if (selectedDays.length === 0) {
      setError("Please select at least one visit day.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit() {
    if (!primary.name || !primary.phone || !primary.relationship) {
      setError("Please fill in all primary contact fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form1.name,
        phone: form1.phone,
        age: parseInt(form1.age),
        gender: form1.gender,
        address: form1.address,
        bio: form1.bio,
        medicalConditions: conditions,
        mobilityNotes,
        familyMemberId: "family001",
        visitSchedule: {
          days: selectedDays.map(d => DAY_FULL[d]),
          escalateAfterHours: escalateHours
        },
        emergencyContact: {
          name: primary.name,
          phone: primary.phone,
          relationship: primary.relationship,
          note: primary.note
        },
        secondaryContact: {
          name: secondary.name,
          phone: secondary.phone,
          relationship: secondary.relationship,
          note: secondary.note
        }
      };

      const res = await fetch("http://localhost:1078/api/elders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-[#f0f4f0] border border-transparent rounded-lg px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-[#4a9a7a] transition";
  const labelClass = "block text-sm text-gray-500 mb-1";

  return (
    <main className="min-h-screen py-10 px-4" style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-4">
        <Image src="/logo.png" alt="Logo" width={48} height={48} />
        <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
      </div>

      {/* Step 1 title */}
      {step === 1 && (
        <h1 className="text-4xl font-bold text-center text-[#2a5a4a] mb-4">Account Information</h1>
      )}

      {/* Info banner */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="border border-gray-300 rounded-lg px-6 py-3 text-center text-gray-500 text-sm bg-white/40">
          Fill in your elderly relative&apos;s details. This helps us assign the right checker and set an appropriate visit schedule.
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10">

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            {/* Photo upload */}
            <div>
              <button
                onClick={() => fileRef.current.click()}
                className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 hover:border-[#4a9a7a] transition"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} placeholder="Enter elder's full name..." value={form1.name} onChange={e => setForm1({ ...form1, name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input className={inputClass} placeholder="Enter elder's phone number" value={form1.phone} onChange={e => setForm1({ ...form1, phone: e.target.value })} />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Age</label>
                <input className={inputClass} type="number" placeholder="Enter elder's" value={form1.age} onChange={e => setForm1({ ...form1, age: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select className={inputClass} value={form1.gender} onChange={e => setForm1({ ...form1, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Address</label>
              <input className={inputClass} placeholder="Enter elder's address" value={form1.address} onChange={e => setForm1({ ...form1, address: e.target.value })} />
            </div>

            {/* Bio */}
            <div>
              <label className={labelClass}>Bio</label>
              <textarea className={`${inputClass} resize-none h-28`} placeholder="Brief description..." value={form1.bio} onChange={e => setForm1({ ...form1, bio: e.target.value })} />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={() => { if (validateStep1()) setStep(2); }}
                className="px-8 py-3 bg-[#4a9a7a] text-white rounded-full font-medium hover:bg-[#3a7a5a] transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-8">
            {/* Medical Condition */}
            <div>
              <h2 className="text-xl font-bold text-[#2a7a5a] mb-2 pb-2 border-b border-gray-200">Medical Condition</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {conditions.map(c => (
                  <span key={c} className="flex items-center gap-1 px-3 py-1 bg-[#e0f0e8] text-[#2a7a5a] rounded-full text-sm">
                    {c}
                    <button onClick={() => removeCondition(c)} className="ml-1 text-[#2a7a5a] hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
              <input
                className={inputClass}
                placeholder="Type a condition and press enter..."
                value={conditionInput}
                onChange={e => setConditionInput(e.target.value)}
                onKeyDown={addCondition}
              />
            </div>

            {/* Mobility Notes */}
            <div>
              <h2 className="text-xl font-bold text-[#2a7a5a] mb-2 pb-2 border-b border-gray-200">Mobility Notes</h2>
              <textarea
                className={`${inputClass} resize-none h-28`}
                placeholder="e.g. Uses a walking stick. Difficulty climbing stairs..."
                value={mobilityNotes}
                onChange={e => setMobilityNotes(e.target.value)}
              />
            </div>

            {/* Visit Schedule */}
            <div>
              <h2 className="text-xl font-bold text-[#2a7a5a] mb-2 pb-2 border-b border-gray-200">Select which days a checker should visit each week</h2>
              <div className="flex gap-3 flex-wrap mt-4">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selectedDays.includes(day) ? "bg-[#4a9a7a] text-white border-[#4a9a7a]" : "bg-white text-gray-600 border-gray-300 hover:border-[#4a9a7a]"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Escalate hours */}
              <div className="flex items-center gap-3 mt-6 text-sm text-gray-600">
                <span>Escalate if no check-in within</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={escalateHours}
                  onChange={e => setEscalateHours(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-14 text-center border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-[#4a9a7a]"
                />
                <span>hours of scheduled visit</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={() => { if (validateStep2()) setStep(3); }}
                className="px-8 py-3 bg-[#4a9a7a] text-white rounded-full font-medium hover:bg-[#3a7a5a] transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="flex flex-col gap-10">
            {/* Primary Contact */}
            <div>
              <h2 className="text-xl font-bold text-[#2a7a5a] mb-4 pb-2 border-b border-gray-200">Primary Contact Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Contact Name</label>
                  <input className={inputClass} placeholder="Rahim Hossain" value={primary.name} onChange={e => setPrimary({ ...primary, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input className={inputClass} placeholder="017XXXXXXXX" value={primary.phone} onChange={e => setPrimary({ ...primary, phone: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Relationship</label>
                  <input className={inputClass} placeholder="Son" value={primary.relationship} onChange={e => setPrimary({ ...primary, relationship: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <input className={inputClass} placeholder="Lives in Dhaka, available 9AM-9PM" value={primary.note} onChange={e => setPrimary({ ...primary, note: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Secondary Contact */}
            <div>
              <h2 className="text-xl font-bold text-[#2a7a5a] mb-4 pb-2 border-b border-gray-200">Secondary Contact Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Contact Name</label>
                  <input className={inputClass} placeholder="Karim Hossain" value={secondary.name} onChange={e => setSecondary({ ...secondary, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input className={inputClass} placeholder="017XXXXXXXX" value={secondary.phone} onChange={e => setSecondary({ ...secondary, phone: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Relationship</label>
                  <input className={inputClass} placeholder="Son" value={secondary.relationship} onChange={e => setSecondary({ ...secondary, relationship: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <input className={inputClass} placeholder="Lives in Dhaka, available 12PM-10PM" value={secondary.note} onChange={e => setSecondary({ ...secondary, note: e.target.value })} />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-[#4a9a7a] text-white rounded-full font-medium hover:bg-[#3a7a5a] transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}