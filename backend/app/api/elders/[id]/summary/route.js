import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import Escalation from "@/models/Escalation";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { NextResponse } from "next/server";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function nextScheduledDate(days) {
  if (!days || days.length === 0) return null;
  const todayIdx = new Date().getDay();
  const wanted = days.map((d) => DAY_NAMES.indexOf(d)).filter((i) => i !== -1);
  if (wanted.length === 0) return null;
  for (let offset = 0; offset <= 7; offset++) {
    const idx = (todayIdx + offset) % 7;
    if (wanted.includes(idx)) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return { date, dayName: DAY_NAMES[idx], isToday: offset === 0 };
    }
  }
  return null;
}

// GET /api/elders/[id]/summary?familyMemberId=...
//
// One aggregate call for the Family Monitoring Dashboard: today's visit
// status, assigned checker, next scheduled visit, open escalations, and
// concern score/trend — everything needed for one dashboard card without
// making 4-5 separate requests per elder.
export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's dashboard" }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayVisit = await Visit.findOne({ elderId: id, visitDate: { $gte: startOfToday } }).sort({ visitDate: -1 });

    const checker = elder.assignedCheckerId
      ? await Checker.findById(elder.assignedCheckerId).select("name phone serviceArea")
      : null;

    const openEscalations = await Escalation.find({ elderId: id, status: "Open" }).sort({ triggeredAt: -1 });

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const metrics = applyOverride(computeConcernMetrics(visits), elder);

    return NextResponse.json(
      {
        success: true,
        data: {
          status: elder.status,
          todayVisit: todayVisit
            ? { status: todayVisit.status, visitDate: todayVisit.visitDate, checkerName: todayVisit.checkerName }
            : null,
          checker: checker ? { id: checker._id, name: checker.name, phone: checker.phone, serviceArea: checker.serviceArea } : null,
          upcomingVisit: nextScheduledDate(elder.visitSchedule?.days),
          openEscalationCount: openEscalations.length,
          latestEscalation: openEscalations[0] || null,
          concernScore: metrics.concernScore,
          category: metrics.category,
          trendDetail: metrics.trend,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}