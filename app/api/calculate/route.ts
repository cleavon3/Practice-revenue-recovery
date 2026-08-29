import { NextResponse } from "next/server";

import { generateRevenueReport } from "@/lib/reportGenerator";
import { createSessionId } from "@/lib/session";
import { supabase } from "@/lib/supabase";

import type { PracticeType } from "@/config/benchmarks";

console.log("✅ CALCULATE ROUTE REGISTERED");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      practiceName,
      practiceType,
      email,
      monthlyCalls,
      missedCallPercentage,
      averagePatientValue,
    } = body;

    /*
     * --------------------------------------------------
     * VALIDATE PRACTICE TYPE
     * --------------------------------------------------
     */

    if (!practiceType || typeof practiceType !== "string") {
      return NextResponse.json(
        {
          error: "Practice type is required",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * VALIDATE EMAIL
     * --------------------------------------------------
     */

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        {
          error: "Email address is required",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Basic email validation.
     */

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!emailIsValid) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * CONVERT NUMERIC INPUTS
     * --------------------------------------------------
     */

    const callVolume = Number(monthlyCalls);

    const missedPercent = Number(missedCallPercentage);

    const patientValue = Number(averagePatientValue);

    /*
     * --------------------------------------------------
     * VALIDATE MONTHLY CALLS
     * --------------------------------------------------
     */

    if (!Number.isFinite(callVolume) || callVolume <= 0) {
      return NextResponse.json(
        {
          error: "Monthly calls must be greater than 0",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * VALIDATE MISSED CALL %
     * --------------------------------------------------
     */

    if (
      !Number.isFinite(missedPercent) ||
      missedPercent <= 0 ||
      missedPercent > 100
    ) {
      return NextResponse.json(
        {
          error: "Missed call percentage must be between 0 and 100",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * VALIDATE PATIENT VALUE
     * --------------------------------------------------
     */

    if (!Number.isFinite(patientValue) || patientValue < 0) {
      return NextResponse.json(
        {
          error: "Average patient value must be a valid number",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * GENERATE REVENUE ASSESSMENT
     * --------------------------------------------------
     *
     * practiceType
     *      ↓
     * benchmark group
     *      ↓
     * benchmark constants
     *      ↓
     * revenue calculation
     */

    const report = generateRevenueReport({
      practiceType: practiceType as PracticeType,

      callVolume,

      missedPercent,

      patientValue,
    });

    /*
     * --------------------------------------------------
     * CREATE SESSION
     * --------------------------------------------------
     */

    const sessionId = createSessionId();

    /*
     * --------------------------------------------------
     * SAVE LEAD
     * --------------------------------------------------
     */

    const { error } = await supabase.from("leads").insert({
      session_id: sessionId,

      practice_name: practiceName || "Unknown Practice",

      practice_type: practiceType,

      email: normalizedEmail,

      call_volume: callVolume,

      missed_percent: missedPercent,

      avg_patient_value: patientValue,

      lost_revenue_monthly: report.monthlyLoss,

      lost_revenue_yearly: report.yearlyLoss,

      calculator_completed: true,

      report_purchased: false,

      email_captured: true,

      booking_cta_clicked: false,

      industry: report.benchmarkGroup,
    });

    if (error) {
      console.error("❌ LEAD CREATION ERROR:", error);

      return NextResponse.json(
        {
          error: "Could not save calculator result",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * --------------------------------------------------
     * LOG SUCCESS
     * --------------------------------------------------
     */

    console.log("LEAD CREATED:", sessionId);

    console.log("PRACTICE TYPE:", practiceType);

    console.log("BENCHMARK GROUP:", report.benchmarkGroup);

    console.log("EMAIL:", normalizedEmail);

    /*
     * --------------------------------------------------
     * RETURN RESULT
     * --------------------------------------------------
     */

    return NextResponse.json({
      ...report,

      practiceName: practiceName || "Unknown Practice",

      practiceType,

      sessionId,
    });
  } catch (error) {
    console.error("❌ CALCULATION ERROR:", error);

    return NextResponse.json(
      {
        error: "Calculation failed",
      },
      {
        status: 500,
      },
    );
  }
}
