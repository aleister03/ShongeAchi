import Escalation from "@/models/Escalation";
import connectDB from "@/lib/mongodb";
import { runEscalationSweep } from "@/lib/escalationSweep";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (status && ["Open", "Cleared"].includes(status)) filter.status = status;

    const escalations = await Escalation.find(filter).sort({ triggeredAt: -1 });
    return NextResponse.json({ success: true, data: escalations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST() {
  try {
    const result = await runEscalationSweep();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}