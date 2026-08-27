
"use client";
import { use } from "react";
import ElderWellbeingReport from "@/app/components/ElderWellbeingReport.js";

export default function AdminElderWellbeing({ params }) {
  const { id } = use(params);
  return <main className="checkerMain"><p className="eyebrow">Elders › Wellbeing</p><ElderWellbeingReport elderId={id} role="admin" /></main>;
}