// frontend/app/family/elders/[id]/wellbeing/page.js
"use client";
import { use } from "react";
import ElderWellbeingReport from "@/app/components/ElderWellbeingReport.js";

export default function FamilyElderWellbeing({ params }) {
  const { id } = use(params);
  return <main className="checkerMain"><p className="eyebrow">Wellbeing Report</p><ElderWellbeingReport elderId={id} role="family" /></main>;
}