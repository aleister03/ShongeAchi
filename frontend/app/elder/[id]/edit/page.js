"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import SearchableCombobox from "@/app/components/SearchableCombobox";
import MEDICAL_CONDITIONS from "@/lib/medicalConditionsList";
import RELATIONSHIPS from "@/lib/relationshipsList";
import { api } from "@/lib/apiClient";

const WEEK_DAYS = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
// 11-digit BD mobile number starting with one of these operator prefixes —
// same validation as the register-elder form, since this is editing the
// same fields.
const PHONE_REGEX = /^(017|013|018|019|014)\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_HINT = "11 digits, starting with 017, 013, 018, 019, or 014";

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#2a7a5a]";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";
const sectionHeadingClass = "text-lg font-bold text-[#2a5a4a] mb-3";

export default function EditElderProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Personal info
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Address
  const [address, setAddress] = useState({
    flatFloor: "", houseNo: "", road: "", areaTahna: "", city: "", postalCode: "", country: "Bangladesh",
  });

  // Contacts
  const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", email: "", relationship: "", note: "" });
  const [secondaryContact, setSecondaryContact] = useState({ name: "", phone: "", email: "", relationship: "", note: "" });

  // Medical / mobility
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [conditionInput, setConditionInput] = useState("");
  const [mobilityNotes, setMobilityNotes] = useState("");

  // Visit schedule
  const [days, setDays] = useState([]);
  const [escalateAfterHours, setEscalateAfterHours] = useState(4);
  const [scheduledTime, setScheduledTime] = useState("10:00");

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/edit`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/elders/${id}?familyMemberId=${familyMemberId}`)
      .then((res) => {
        const elder = res.data;
        setName(elder.name || "");
        setAge(elder.age ?? "");
        setGender(elder.gender || "");
        setPhone(elder.phone || "");
        setBio(elder.bio || "");
        setAddress({
          flatFloor: elder.address?.flatFloor || "",
          houseNo: elder.address?.houseNo || "",
          road: elder.address?.road || "",
          areaTahna: elder.address?.areaTahna || "",
          city: elder.address?.city || "",
          postalCode: elder.address?.postalCode || "",
          country: elder.address?.country || "Bangladesh",
        });
        setEmergencyContact({
          name: elder.emergencyContact?.name || "",
          phone: elder.emergencyContact?.phone || "",
          email: elder.emergencyContact?.email || "",
          relationship: elder.emergencyContact?.relationship || "",
          note: elder.emergencyContact?.note || "",
        });
        setSecondaryContact({
          name: elder.secondaryContact?.name || "",
          phone: elder.secondaryContact?.phone || "",
          email: elder.secondaryContact?.email || "",
          relationship: elder.secondaryContact?.relationship || "",
          note: elder.secondaryContact?.note || "",
        });
        setMedicalConditions(elder.medicalConditions || []);
        setMobilityNotes(elder.mobilityNotes || "");
        // visitSchedule.days is stored as the same 3-letter abbreviations
        // used by the register-elder form ("WED", "THU", ...) — NOT full
        // day names. Load it as-is; do not map through any day-name table.
        setDays(elder.visitSchedule?.days || []);
        setEscalateAfterHours(elder.visitSchedule?.escalateAfterHours ?? 4);
        setScheduledTime(elder.visitSchedule?.scheduledTime || "10:00");
        setLoaded(true);
      })
      .catch((err) => setError(err.message || "Couldn't load this profile."));
  }, [id, status, familyMemberId]);

  function toggleDay(abbr) {
    setDays((prev) => (prev.includes(abbr) ? prev.filter((d) => d !== abbr) : [...prev, abbr]));
  }

  function addCondition(e) {
    if (e.key !== "Enter" || !conditionInput.trim()) return;
    e.preventDefault();
    const value = conditionInput.trim();
    setMedicalConditions((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setConditionInput("");
  }

  function removeCondition(cond) {
    setMedicalConditions((prev) => prev.filter((c) => c !== cond));
  }

  function validate() {
    if (!name || !age || !gender || !phone) {
      setError("Please fill in all required personal fields.");
      return false;
    }
    const ageNum = Number(age);
    if (ageNum < 30 || ageNum > 120) {
      setError("Age must be between 30 and 120.");
      return false;
    }
    if (!PHONE_REGEX.test(phone)) {
      setError(`Elder's phone number is invalid. It must be ${PHONE_HINT}.`);
      return false;
    }
    if (!address.areaTahna || !address.city) {
      setError("Area and city are required.");
      return false;
    }
    if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.email || !emergencyContact.relationship) {
      setError("Primary emergency contact is required, including email.");
      return false;
    }
    if (!EMAIL_REGEX.test(emergencyContact.email)) {
      setError("Please enter a valid email for the primary emergency contact.");
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
    return true;
  }

  async function handleSave() {
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      await api.put(`/api/elders/${id}?familyMemberId=${familyMemberId}`, {
        name,
        age: Number(age),
        gender,
        phone,
        bio,
        address,
        emergencyContact,
        secondaryContact,
        medicalConditions,
        mobilityNotes,
        // Save the same 3-letter abbreviations that were loaded — no
        // conversion to/from full day names.
        visitSchedule: { days, scheduledTime, escalateAfterHours: Number(escalateAfterHours) },
      });
      router.push(`/elder/${id}/profile`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="profile" />
      <div className="px-10 py-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Edit Profile</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!loaded ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-8">
            <div>
              <h2 className={sectionHeadingClass}>Personal Information</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      min={30}
                      max={120}
                      className={inputClass}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  />
                  <p className="text-xs text-gray-400 mt-1">{PHONE_HINT}</p>
                </div>
                <div>
                  <label className={labelClass}>Short Bio (optional)</label>
                  <textarea
                    className={`${inputClass} h-24 resize-none`}
                    placeholder="A short note about this elder"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className={sectionHeadingClass}>Address</h2>
              <div className="flex flex-col gap-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input className={inputClass} value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input className={inputClass} value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className={sectionHeadingClass}>Primary Emergency Contact*</h2>
              <div className="flex flex-col gap-4">
                <input placeholder="Name" className={inputClass} value={emergencyContact.name} onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })} />
                <input
                  type="email"
                  placeholder="Email"
                  className={inputClass}
                  value={emergencyContact.email}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, email: e.target.value })}
                />
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
                <textarea
                  className={`${inputClass} h-16 resize-none`}
                  placeholder="Note (optional)"
                  value={emergencyContact.note}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, note: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h2 className={sectionHeadingClass}>Secondary Contact (optional)</h2>
              <div className="flex flex-col gap-4">
                <input placeholder="Name" className={inputClass} value={secondaryContact.name} onChange={(e) => setSecondaryContact({ ...secondaryContact, name: e.target.value })} />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  className={inputClass}
                  value={secondaryContact.email}
                  onChange={(e) => setSecondaryContact({ ...secondaryContact, email: e.target.value })}
                />
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
                <textarea
                  className={`${inputClass} h-16 resize-none`}
                  placeholder="Note (optional)"
                  value={secondaryContact.note}
                  onChange={(e) => setSecondaryContact({ ...secondaryContact, note: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h2 className={sectionHeadingClass}>Medical Conditions</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {medicalConditions.map((cond) => (
                  <span
                    key={cond}
                    className="bg-[#e6f2dd] text-[#2a5a4a] px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                  >
                    {cond}
                    <button onClick={() => removeCondition(cond)} className="text-[#2a5a4a] hover:text-red-500">
                      ×
                    </button>
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
              <h2 className={sectionHeadingClass}>Mobility Notes</h2>
              <textarea
                className={`${inputClass} h-24 resize-none`}
                value={mobilityNotes}
                onChange={(e) => setMobilityNotes(e.target.value)}
              />
            </div>

            <div>
              <h2 className={sectionHeadingClass}>Visit Schedule</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {WEEK_DAYS.map((abbr) => (
                  <button
                    key={abbr}
                    onClick={() => toggleDay(abbr)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      days.includes(abbr)
                        ? "bg-[#2a7a5a] text-white border-[#2a7a5a]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#2a7a5a]"
                    }`}
                  >
                    {abbr}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                <span>Expected visit time</span>
                <input
                  type="time"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span>Escalate if no check-in within</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center"
                  value={escalateAfterHours}
                  onChange={(e) => setEscalateAfterHours(e.target.value)}
                />
                <span>hours of scheduled visit</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => router.push(`/elder/${id}/profile`)}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-2.5 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#1f5e44] transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
