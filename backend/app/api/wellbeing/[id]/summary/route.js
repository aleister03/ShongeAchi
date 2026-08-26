import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Builds a compact, factual description of the visit history for the model
// to reason over — no PII beyond the elder's first name, and no medical
// diagnosis language, just what the checkers logged.
function buildPrompt(elder, visits) {
  const lines = visits
    .map(
      (v, i) =>
        `${i + 1}. ${new Date(v.visitDate).toLocaleDateString()} — status: ${v.status}, appetite: ${v.appetiteLevel}, mobility: ${v.mobilityLevel}, medication taken: ${v.medicationTaken ? "yes" : "no"}${v.notes ? `, checker note: "${v.notes}"` : ""}`
    )
    .join("\n");

  return (
    `You are a wellbeing analyst for an elder-care monitoring platform. Below are the ` +
    `${visits.length} most recent check-in visits for ${elder.name}, oldest first. ` +
    `Look for patterns ACROSS visits over time (e.g. a status that looks fine each time ` +
    `individually but a metric that has been quietly declining) rather than just reacting ` +
    `to the single most recent visit.\n\n${lines}\n\n` +
    `Write a concise 2-4 sentence wellbeing summary for the family, in plain, warm, ` +
    `non-clinical language. Do not diagnose any medical condition. Then on a new line, ` +
    `write exactly one of: "RECOMMENDATION: increase" or "RECOMMENDATION: maintain" ` +
    `based on whether visit frequency should increase.`
  );
}

// Fallback used if no API key is configured, or the Gemini call fails —
// keeps the endpoint (and the demo) working even without AI configured.
function templateSummary(elder, visits) {
  const concernedCount = visits.filter((v) => v.status === "Concerned").length;
  const noAnswerCount = visits.filter((v) => v.status === "No Answer").length;
  const poorAppetiteCount = visits.filter((v) => v.appetiteLevel === "Poor").length;
  const poorMobilityCount = visits.filter((v) => v.mobilityLevel === "Poor").length;
  const missedMedCount = visits.filter((v) => !v.medicationTaken).length;
  const summary =
    `Wellbeing summary for ${elder.name} based on last ${visits.length} visits: ` +
    `${concernedCount} concerned visit(s), ${noAnswerCount} no-answer visit(s), ` +
    `${poorAppetiteCount} poor appetite report(s), ${poorMobilityCount} poor mobility report(s), ` +
    `${missedMedCount} missed medication(s). ` +
    `${poorMobilityCount >= 2 ? "Mobility is showing a declining trend — consider increasing visit frequency." : "No critical trend detected."}`;
  return {
    summary,
    recommendation: poorMobilityCount >= 2 || concernedCount >= 2 ? "Increase visit frequency" : "Continue current schedule",
    source: "template",
  };
}

async function callGemini(elder, visits) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = buildPrompt(elder, visits);

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const recommendMatch = text.match(/RECOMMENDATION:\s*(increase|maintain)/i);
  const summary = text.replace(/RECOMMENDATION:\s*(increase|maintain)/i, "").trim();

  return {
    summary,
    recommendation: recommendMatch?.[1]?.toLowerCase() === "increase" ? "Increase visit frequency" : "Continue current schedule",
    source: "gemini",
  };
}

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: -1 }).limit(10);

    let result = null;
    if (visits.length > 0) {
      try {
        result = await callGemini(elder, [...visits].reverse());
      } catch {
        result = null;
      }
    }
    if (!result) {
      result =
        visits.length > 0
          ? templateSummary(elder, visits)
          : { summary: "Not enough visits recorded yet to generate a summary.", recommendation: "Continue current schedule", source: "none" };
    }

    return NextResponse.json(
      { success: true, data: { elderName: elder.name, totalVisitsAnalyzed: visits.length, ...result } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}