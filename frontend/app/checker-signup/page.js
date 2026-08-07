"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const initialForm = {
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
  serviceArea: "",
  workingHoursStart: "08:00",
  workingHoursEnd: "17:00",
  experienceYears: ""
};

function validateFile(file, label) {
  if (!file) return `${label} is required.`;
  if (!ACCEPTED_TYPES.includes(file.type)) return `${label} must be a JPG or PNG file.`;
  if (file.size > MAX_FILE_SIZE) return `${label} must be 5MB or smaller.`;
  return "";
}

function UploadField({ id, label, description, file, error, onChange }) {
  return <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-[#294d42]">{label}</label>
    <label htmlFor={id} className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${error ? "border-red-300 bg-red-50" : "border-[#a9c9bc] bg-[#f7faf7] hover:border-[#2a7a5a]"}`}>
      <span className="text-sm font-medium text-[#2a7a5a]">{file ? file.name : "Choose a JPG or PNG"}</span>
      <span className="mt-1 text-xs text-gray-500">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : description}</span>
    </label>
    <input id={id} className="sr-only" type="file" accept="image/jpeg,image/png" onChange={onChange}/>
    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
  </div>;
}

export default function CheckerSignupPage() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({ nidPhoto: null, profilePhoto: null });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  }, [profilePreview]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function updateFile(field, event) {
    const file = event.target.files?.[0] || null;
    setFiles((current) => ({ ...current, [field]: file }));
    setErrors((current) => ({ ...current, [field]: "" }));
    if (field === "profilePhoto") {
      setProfilePreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return file ? URL.createObjectURL(file) : "";
      });
    }
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!/^01\d{9}$/.test(form.phone.trim())) nextErrors.phone = "Enter a valid 11-digit Bangladeshi phone number.";
    if (form.password.length < 8) nextErrors.password = "Password must contain at least 8 characters.";
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    if (!form.serviceArea.trim()) nextErrors.serviceArea = "Service area is required.";
    if (!form.workingHoursStart) nextErrors.workingHoursStart = "Start time is required.";
    if (!form.workingHoursEnd) nextErrors.workingHoursEnd = "End time is required.";
    if (form.workingHoursStart && form.workingHoursEnd && form.workingHoursStart >= form.workingHoursEnd) nextErrors.workingHoursEnd = "End time must be later than start time.";
    if (form.experienceYears === "" || Number(form.experienceYears) < 0) nextErrors.experienceYears = "Enter zero or more years of experience.";
    nextErrors.nidPhoto = validateFile(files.nidPhoto, "NID front photo");
    nextErrors.profilePhoto = validateFile(files.profilePhoto, "Profile picture");
    Object.keys(nextErrors).forEach((key) => { if (!nextErrors[key]) delete nextErrors[key]; });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#eaf4e4,#c6ded8)] px-5 py-12">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        {profilePreview && <Image src={profilePreview} alt="Submitted profile" width={92} height={92} unoptimized className="mx-auto mb-5 h-24 w-24 rounded-full object-cover"/>}
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e6f4df] text-2xl text-[#2a7a5a]">✓</span>
        <h1 className="text-3xl font-bold text-[#234f42]">Awaiting verification</h1>
        <p className="mt-4 leading-7 text-gray-600">Thank you, {form.name}. Your proposed service area and documents are ready for admin review. A checker account remains unable to receive elder assignments until an admin explicitly approves it.</p>
        <div className="mt-7 rounded-2xl bg-[#fff9dc] p-4 text-sm text-[#675d2d]">Frontend preview only: this submission has not been saved to the backend yet.</div>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#2a7a5a] px-7 py-3 font-medium text-white">Return home</Link>
      </section>
    </main>;
  }

  const inputClass = "w-full rounded-xl border border-[#cbd9d2] bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-[#2a7a5a] focus:ring-2 focus:ring-[#2a7a5a]/15";
  const labelClass = "mb-2 block text-sm font-semibold text-[#294d42]";

  return <main className="min-h-screen bg-[linear-gradient(145deg,#edf6e7,#c7dfd9)] px-4 py-8 sm:px-8">
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="mb-7 inline-flex items-center gap-3 text-xl font-bold text-[#187663]"><Image src="/logo.png" alt="Shonge Achi" width={61} height={48} style={{ width: "auto", height: "48px" }}/>Shonge Achi</Link>
      <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <header className="border-b border-[#e2ebe6] px-6 py-8 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2a7a5a]">Checker application</p>
          <h1 className="mt-2 text-3xl font-bold text-[#234f42] sm:text-4xl">Help families stay close</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Apply to become a field checker. Your account will remain limited until an admin verifies your identity and approves your proposed coverage.</p>
        </header>

        <div className="space-y-10 px-6 py-8 sm:px-10">
          <section><h2 className="mb-5 text-xl font-bold text-[#234f42]">Personal and account details</h2><div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="name">Full name as shown on NID</label><input id="name" name="name" value={form.name} onChange={updateField} className={inputClass} autoComplete="name"/>{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}</div>
            <div><label className={labelClass} htmlFor="phone">Phone number</label><input id="phone" name="phone" value={form.phone} onChange={updateField} className={inputClass} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX"/>{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}</div>
            <div><label className={labelClass} htmlFor="serviceArea">Proposed service area</label><input id="serviceArea" name="serviceArea" value={form.serviceArea} onChange={updateField} className={inputClass} placeholder="e.g. Dhanmondi"/>{errors.serviceArea && <p className="mt-1 text-sm text-red-600">{errors.serviceArea}</p>}</div>
            <div><label className={labelClass} htmlFor="password">Password</label><input id="password" name="password" type="password" value={form.password} onChange={updateField} className={inputClass} autoComplete="new-password"/>{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}</div>
            <div><label className={labelClass} htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} className={inputClass} autoComplete="new-password"/>{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}</div>
          </div></section>

          <section><h2 className="mb-5 text-xl font-bold text-[#234f42]">Availability and experience</h2><div className="grid gap-5 sm:grid-cols-3">
            <div><label className={labelClass} htmlFor="workingHoursStart">Working from</label><input id="workingHoursStart" name="workingHoursStart" type="time" value={form.workingHoursStart} onChange={updateField} className={inputClass}/>{errors.workingHoursStart && <p className="mt-1 text-sm text-red-600">{errors.workingHoursStart}</p>}</div>
            <div><label className={labelClass} htmlFor="workingHoursEnd">Working until</label><input id="workingHoursEnd" name="workingHoursEnd" type="time" value={form.workingHoursEnd} onChange={updateField} className={inputClass}/>{errors.workingHoursEnd && <p className="mt-1 text-sm text-red-600">{errors.workingHoursEnd}</p>}</div>
            <div><label className={labelClass} htmlFor="experienceYears">Experience (years)</label><input id="experienceYears" name="experienceYears" type="number" min="0" step="0.5" value={form.experienceYears} onChange={updateField} className={inputClass}/>{errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>}</div>
          </div></section>

          <section><h2 className="mb-2 text-xl font-bold text-[#234f42]">Identity documents</h2><p className="mb-5 text-sm text-gray-600">Both images are required for verification. Files are validated again by the server when backend signup is connected.</p><div className="grid gap-6 sm:grid-cols-2">
            <UploadField id="nidPhoto" label="NID front photo" description="Clear, readable front side · max 5MB" file={files.nidPhoto} error={errors.nidPhoto} onChange={(event) => updateFile("nidPhoto", event)}/>
            <UploadField id="profilePhoto" label="Profile picture" description="Clear face photo · max 5MB" file={files.profilePhoto} error={errors.profilePhoto} onChange={(event) => updateFile("profilePhoto", event)}/>
          </div></section>

          <div className="rounded-2xl border border-[#eadc9a] bg-[#fff9dc] p-5 text-sm leading-6 text-[#62592d]"><strong>Verification is mandatory.</strong> Signing up does not make a checker assignable. Only an explicit admin approval can activate the account for elder assignments.</div>
          <button type="submit" className="w-full rounded-full bg-[#2a7a5a] px-8 py-4 font-semibold text-white transition hover:bg-[#215f49] focus:outline-none focus:ring-4 focus:ring-[#2a7a5a]/20">Submit application</button>
        </div>
      </form>
    </div>
  </main>;
}
