"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "@/lib/apiClient";
import SearchableCombobox from "@/app/components/SearchableCombobox";
import MEDICAL_CONDITIONS from "@/lib/medicalConditionsList";
import RELATIONSHIPS from "@/lib/relationshipsList";

const WEEK_DAYS = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
// 11-digit BD mobile number starting with one of these operator prefixes.
const PHONE_REGEX = /^(017|013|018|019|014)\d{8}$/;
const PHONE_HINT = "11 digits, starting with 017, 013, 018, 019, or 014";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-[#2a7a5a] transition";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";

export default function RegisterElder() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/register-elder");
    }
  }, [status, router]);

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [personal, setPersonal] = useState({ name: "", age: "", gender: "", phone: "", bio: "" });
  const [address, setAddress] = useState({
    flatFloor: "", houseNo: "", road: "", areaTahna: "", city: "", postalCode: "", country: "Bangladesh",
  });
  const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", relationship: "", note: "" });
  const [secondaryContact, setSecondaryContact] = useState({ name: "", phone: "", relationship: "", note: "" });
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [conditionInput, setConditionInput] = useState("");
  const [mobilityNotes, setMobilityNotes] = useState("");
  const [days, setDays] = useState([]);
  const [escalateAfterHours, setEscalateAfterHours] = useState(4);

  function toggleDay(day) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function addCondition(e) {
    if (e.key === "Enter" && conditionInput.trim()) {
      e.preventDefault();
      setMedicalConditions((prev) => [...prev, conditionInput.trim()]);
      setConditionInput("");
    }
  }

  function removeCondition(cond) {
    setMedicalConditions((prev) => prev.filter((c) => c !== cond));
  }

  function validateStep() {
    setError("");
    if (step === 0) {
      if (!personal.name || !personal.age || !personal.gender || !personal.phone) {
        setError("Please fill in all required fields.");
        return false;
      }
      const age = Number(personal.age);
      if (age < 30 || age > 120) {
        setError("Age must be between 30 and 120.");
        return false;
      }
      if (!PHONE_REGEX.test(personal.phone)) {
        setError(`Phone number is invalid. It must be ${PHONE_HINT}.`);
        return false;
      }
    }
    if (step === 1 && (!address.areaTahna || !address.city)) {
      setError("Area and city are required.");
      return false;
    }
    if (step === 2) {
      if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.relationship) {
        setError("Primary emergency contact is required.");
        return false;
      }
      if (!PHONE_REGEX.test(emergencyContact.phone)) {
        setError(`Emergency contact phone is invalid. It must be ${PHONE_HINT}.`);
        return false;
      }
      if (secondaryContact.phone && !PHONE_REGEX.test(secondaryContact.phone)) {
        setError(`Secondary contact phone is invalid. It must be ${PHONE_HINT}.`);
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/api/elders", {
        ...personal,
        age: Number(personal.age),
        address,
        emergencyContact,
        secondaryContact,
        medicalConditions,
        mobilityNotes,
        familyMemberId: session?.user?.id || "demo-family-1",
        visitSchedule: { days, escalateAfterHours: Number(escalateAfterHours) },
      });
      router.push(`/elder/${res.data._id}/profile`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = ["Personal Info", "Address", "Emergency Contact", "Medical & Schedule"];

  // While NextAuth is resolving the session, or once we know the user isn't
  // signed in and we're about to redirect them, don't flash the form.
  if (status === "loading" || status === "unauthenticated") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}
      >
        <p className="text-[#2a5a4a] text-sm">
          {status === "loading" ? "Loading..." : "Redirecting to sign in..."}
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-6 py-12"
      style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Image src="/logo.png" alt="Shonge Achi Logo" width={40} height={40} />
        <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
      </div>

      <div className="bg-white/60 border border-[#cfe3c9] rounded-xl px-6 py-3 text-sm text-[#2a5a4a] mb-8 max-w-xl text-center">
        Fill in your elderly relative&apos;s details. This helps us assign the right checker and set an appropriate visit schedule.
      </div>

      <div className="flex items-center gap-3 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i <= step ? "bg-[#2a7a5a] text-white" : "bg-white text-gray-400 border border-gray-300"
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className={`w-10 h-0.5 ${i < step ? "bg-[#2a7a5a]" : "bg-gray-300"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-2xl">
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-[#2a5a4a] mb-2">Personal Information</h2>
            <div>
              <label className={labelClass}>Full Name</label>
              <input className={inputClass} value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  min={30}
                  max={120}
                  className={inputClass}
                  value={personal.age}
                  onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select className={inputClass} value={personal.gender} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                placeholder="017XXXXXXXX"
                maxLength={11}
                inputMode="numeric"
                value={personal.phone}
                onChange={(e) => setPersonal({ ...personal, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
              />
              <p className="text-xs text-gray-400 mt-1">{PHONE_HINT}</p>
            </div>
            <div>
              <label className={labelClass}>Short Bio (optional)</label>
              <textarea className={inputClass} rows={3} value={personal.bio} onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-[#2a5a4a] mb-2">Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Flat / Floor</label>
                <input className={inputClass} value={address.flatFloor} onChange={(e) => setAddress({ ...address, flatFloor: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>House No.</label>
                <input className={inputClass} value={address.houseNo} onChange={(e) => setAddress({ ...address, houseNo: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Road</label>
              <input className={inputClass} value={address.road} onChange={(e) => setAddress({ ...address, road: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Area / Thana</label>
                <input className={inputClass} value={address.areaTahna} onChange={(e) => setAddress({ ...address, areaTahna: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input className={inputClass} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input className={inputClass} value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2a5a4a] mb-4">Primary Emergency Contact</h2>
              <div className="flex flex-col gap-4">
                <input placeholder="Name" className={inputClass} value={emergencyContact.name} onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      placeholder="017XXXXXXXX"
                      className={inputClass}
                      maxLength={11}
                      inputMode="numeric"
                      value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                    />
                    <p className="text-xs text-gray-400 mt-1">{PHONE_HINT}</p>
                  </div>
                  <SearchableCombobox
                    className={inputClass}
                    placeholder="Relationship"
                    options={RELATIONSHIPS}
                    value={emergencyContact.relationship}
                    onChange={(v) => setEmergencyContact({ ...emergencyContact, relationship: v })}
                    onSelect={(v) => setEmergencyContact({ ...emergencyContact, relationship: v })}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2a5a4a] mb-4">Secondary Contact (optional)</h2>
              <div className="flex flex-col gap-4">
                <input placeholder="Name" className={inputClass} value={secondaryContact.name} onChange={(e) => setSecondaryContact({ ...secondaryContact, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      placeholder="017XXXXXXXX"
                      className={inputClass}
                      maxLength={11}
                      inputMode="numeric"
                      value={secondaryContact.phone}
                      onChange={(e) => setSecondaryContact({ ...secondaryContact, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                    />
                    <p className="text-xs text-gray-400 mt-1">{PHONE_HINT}</p>
                  </div>
                  <SearchableCombobox
                    className={inputClass}
                    placeholder="Relationship"
                    options={RELATIONSHIPS}
                    value={secondaryContact.relationship}
                    onChange={(v) => setSecondaryContact({ ...secondaryContact, relationship: v })}
                    onSelect={(v) => setSecondaryContact({ ...secondaryContact, relationship: v })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4">Medical Condition</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {medicalConditions.map((cond) => (
                  <span key={cond} className="flex items-center gap-2 bg-[#e6f2dd] text-[#2a5a4a] px-3 py-1.5 rounded-full text-sm">
                    {cond}
                    <button onClick={() => removeCondition(cond)} className="text-[#2a5a4a]/60 hover:text-[#2a5a4a]">×</button>
                  </span>
                ))}
              </div>
              <SearchableCombobox
                className={inputClass}
                placeholder="Search for a condition, e.g. 'dia' → Diabetes..."
                otherPlaceholder="Type the condition and press enter..."
                options={MEDICAL_CONDITIONS}
                value={conditionInput}
                onChange={setConditionInput}
                onSelect={(opt) => {
                  setMedicalConditions((prev) => (prev.includes(opt) ? prev : [...prev, opt]));
                  setConditionInput("");
                }}
                onKeyDown={addCondition}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4">Mobility Notes</h2>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="e.g. Uses a walking stick. Difficulty climbing stairs."
                value={mobilityNotes}
                onChange={(e) => setMobilityNotes(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4">
                Select which days a checker should visit each week
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {WEEK_DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      days.includes(day)
                        ? "bg-[#2a7a5a] text-white border-[#2a7a5a]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#2a7a5a]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Escalate if no check-in within
                <input
                  type="number"
                  min={1}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-center"
                  value={escalateAfterHours}
                  onChange={(e) => setEscalateAfterHours(e.target.value)}
                />
                hours of scheduled visit
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="flex justify-between mt-10">
          {step > 0 ? (
            <button onClick={back} className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
              Back
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} className="px-8 py-2.5 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#1f5e44] transition">
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#1f5e44] transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Profile"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
