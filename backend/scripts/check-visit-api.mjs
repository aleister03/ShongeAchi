// API contract checks for logging a visit, in the same style as check-checkers.mjs:
// run against a live backend (npm run dev), no extra dependencies, cleans up after
// itself. Run with: npm run test:visits
//
// Guards the regression where POST /api/wellbeing/:id/visits failed with
// "Visit validation failed: checkerName: Path `checkerName` is required" because the
// route never populated the schema-required checkerName from the assigned checker.
import { VISIT_QUESTIONS } from "../lib/visitQuestions.js";

const baseUrl = process.env.API_URL || "http://localhost:3001";

// Fixture creation (checkers, elders, assignments) is admin-only, and /api/auth/register
// cannot mint an admin, so this signs in as the seeded demo admin. Run `npm run seed`
// first, or set ADMIN_EMAIL / ADMIN_PASSWORD for a different account.
const adminEmail = process.env.ADMIN_EMAIL || "admin@demo.test";
const adminPassword = process.env.ADMIN_PASSWORD || "password123";

let checkerId = null;
let elderId = null;
let token = null;
let admin = null;
const stamp = Date.now();

async function request(path, options = {}, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => null);
  if (response.status !== expectedStatus) {
    throw new Error(`${options.method || "GET"} ${path}: expected ${expectedStatus}, received ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

const json = (method, body, bearer) => ({
  method,
  headers: { "Content-Type": "application/json", ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
  body: JSON.stringify(body)
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Every question answered, exactly as the log-visit form submits.
function formResponses(concerning) {
  const good = { q1: "About the same", q3: "Fully", q4b: "Yes", q5: "Yes, normally", q6: "No change",
    q7: "Neutral / calm", q9: "Yes", q10: "Yes, as usual", q11: "Yes", q12: "Yes" };
  const bad = { q1: "Worse than usual", q3: "Not able to", q4b: "No", q5: "Poor intake", q6: "Yes",
    q7: "Distressed / anxious", q9: "No", q10: "Not at all", q11: "No", q12: "No" };
  const table = concerning ? bad : good;

  return VISIT_QUESTIONS.map((q) => {
    let answer;
    if (q.type === "text") answer = concerning ? "Frailer than last week." : "No notable change.";
    else if (table[q.id]) answer = table[q.id];
    else answer = concerning ? (q.options.includes("Yes") ? "Yes" : q.options.at(-1)) : (q.options.includes("No") ? "No" : q.options[0]);
    return { questionId: q.id, answer, detail: "" };
  });
}

const visitBody = (concerning) => ({ status: concerning ? "Concerned" : "Fine", responses: formResponses(concerning) });

try {
  // --- fixtures -------------------------------------------------------------
  const login = await request("/api/auth/login", json("POST", { email: adminEmail, password: adminPassword }));
  admin = login.data.token;

  const checker = await request("/api/checkers", json("POST", {
    name: "Visit API Checker", serviceArea: "Test", maxWorkload: 5
  }, admin), 201);
  checkerId = checker.data._id;
  await request(`/api/checkers/${checkerId}`, json("PATCH", { verificationStatus: "verified" }, admin));

  const elder = await request("/api/elders", json("POST", {
    name: "Visit API Elder", age: 74, gender: "Other", phone: `01700${stamp % 100000}`,
    address: "Test address", familyMemberId: "visit-api-test",
    emergencyContact: { name: "Test Contact", phone: "01700000000", relationship: "Family" }
  }, admin), 201);
  elderId = elder.data._id;

  await request(`/api/checkers/${checkerId}/assignments`, json("POST", { elderId }, admin), 201);

  const account = await request("/api/auth/register", json("POST", {
    email: `visit-api-${stamp}@test.local`, password: "password123",
    name: "Visit API Checker", role: "checker", checkerId
  }), 201);
  token = account.data.token;

  // --- the regression -------------------------------------------------------
  const logged = await request(`/api/wellbeing/${elderId}/visits`, json("POST", visitBody(false), token), 201);
  assert(logged.data.visit, "response should include the created visit");
  assert(logged.data.visit.checkerName === "Visit API Checker",
    `checkerName should come from the checker record, got ${JSON.stringify(logged.data.visit.checkerName)}`);
  assert(logged.data.visit.responses.length === VISIT_QUESTIONS.length,
    "all questionnaire responses should be stored");
  assert(logged.data.visit.completedAt, "completedAt should be set on a logged visit");
  assert(logged.data.visit.scheduledAt === undefined,
    "an ad-hoc visit should have no scheduledAt, so the on-time rate stays meaningful");
  assert("report" in logged.data, "response should include the per-visit report slot");
  assert(logged.data.aiAssessment, "response should include the refreshed concern assessment");

  // --- server-owned fields cannot be spoofed --------------------------------
  const spoofed = await request(`/api/wellbeing/${elderId}/visits`, json("POST", {
    ...visitBody(true), checkerName: "Somebody Else", checkerId: "000000000000000000000000"
  }, token), 201);
  assert(spoofed.data.visit.checkerName === "Visit API Checker", "client must not be able to set checkerName");
  assert(String(spoofed.data.visit.checkerId) === String(checkerId), "client must not be able to set checkerId");

  // --- validation and authorisation ----------------------------------------
  await request(`/api/wellbeing/${elderId}/visits`, json("POST", { ...visitBody(false), status: "Vibing" }, token), 400);
  await request(`/api/wellbeing/${elderId}/visits`, json("POST", { responses: formResponses(false) }, token), 400);
  await request(`/api/wellbeing/${elderId}/visits`, json("POST", {
    status: "Fine", responses: formResponses(false).slice(0, 4)
  }, token), 400);
  await request(`/api/wellbeing/${elderId}/visits`, json("POST", visitBody(false)), 401);

  // --- reads reflect the writes --------------------------------------------
  // A third valid visit, so the history crosses the threshold where a full trend
  // assessment (rather than a limited-data one) is produced.
  await request(`/api/wellbeing/${elderId}/visits`, json("POST", visitBody(true), token), 201);

  const visits = await request(`/api/wellbeing/${elderId}/visits`, { headers: { Authorization: `Bearer ${token}` } });
  assert(visits.data.length === 3, `expected 3 logged visits, found ${visits.data.length}`);
  assert(visits.data.every((v) => v.checkerName === "Visit API Checker"),
    "every logged visit should carry the checker's name");

  // The assessment is still generated for every elder — it also maintains
  // Elder.concernStatus, which is a free-tier safety signal. What Premium gates is
  // READING the detailed AI output, so a free elder's checker gets 402 here.
  await request(`/api/wellbeing/${elderId}/ai-assessment`, { headers: { Authorization: `Bearer ${token}` } }, 402);
  await request(`/api/wellbeing/${elderId}/concern-score`, { headers: { Authorization: `Bearer ${token}` } }, 402);

  // Generation itself is unaffected: the POST /visits response still carries the
  // refreshed assessment regardless of plan.
  const relogged = await request(`/api/wellbeing/${elderId}/visits`, json("POST", visitBody(false), token), 201);
  assert(relogged.data.aiAssessment, "assessments must keep being generated on the free plan");
  assert(relogged.data.aiAssessment.visitsAnalyzed === 4,
    `expected the assessment to cover all four visits, got ${relogged.data.aiAssessment.visitsAnalyzed}`);

  // Free-plan features are untouched by the paywall.
  const reports = await request(`/api/wellbeing/${elderId}/reports`, { headers: { Authorization: `Bearer ${token}` } });
  assert(Array.isArray(reports.data.reports), "visit reports stay on the free plan");

  console.log("Visit logging, field-spoofing rejection, validation, auth, Premium gating, and concern-assessment refresh checks passed.");
} finally {
  const auth = admin ? { Authorization: `Bearer ${admin}` } : {};
  if (elderId) await fetch(`${baseUrl}/api/elders/${elderId}`, { method: "DELETE", headers: auth });
  if (checkerId) await fetch(`${baseUrl}/api/checkers/${checkerId}`, { method: "DELETE", headers: auth });
}
