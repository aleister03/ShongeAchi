const baseUrl = process.env.API_URL || "http://localhost:3001";
const createdElders = [];
let checkerId;

async function request(path, options = {}, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  if (response.status !== expectedStatus) throw new Error(`${options.method || "GET"} ${path}: expected ${expectedStatus}, received ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const json = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

try {
  const checker = await request("/api/checkers", json("POST", { name: "API Contract Checker", serviceArea: "Test", maxWorkload: 1 }), 201);
  checkerId = checker.data._id;
  await request("/api/checkers");
  await request(`/api/checkers/${checkerId}`);
  await request(`/api/checkers/${checkerId}`, json("PATCH", { verificationStatus: "verified" }));
  await request(`/api/checkers/${checkerId}/capacity`);
  await request(`/api/checkers/${checkerId}/capacity`, json("PATCH", { maxWorkload: 1 }));

  for (const suffix of ["One", "Two"]) {
    const elder = await request("/api/elders", json("POST", {
      name: `API Elder ${suffix}`, age: 70, gender: "Other", phone: `0170000000${createdElders.length}`,
      address: "Test address", familyMemberId: "api-contract-test",
      emergencyContact: { name: "Test Contact", phone: "01700000000", relationship: "Family" }
    }), 201);
    createdElders.push(elder.data._id);
  }

  await request(`/api/checkers/${checkerId}/assignments`, json("POST", { elderId: createdElders[0] }), 201);
  await request(`/api/checkers/${checkerId}/assignments`, json("POST", { elderId: createdElders[1] }), 409);
  await request(`/api/checkers/${checkerId}/assignments`, json("DELETE", { elderId: createdElders[0] }));
  await request(`/api/checkers/${checkerId}`, { method: "DELETE" });
  checkerId = null;
  console.log("Checker CRUD, capacity rejection, assign, and unassign checks passed.");
} finally {
  if (checkerId) await fetch(`${baseUrl}/api/checkers/${checkerId}`, { method: "DELETE" });
  await Promise.all(createdElders.map((id) => fetch(`${baseUrl}/api/elders/${id}`, { method: "DELETE" })));
}
