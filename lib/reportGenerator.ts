import { getBenchmarkProfile, type PracticeType } from "@/config/benchmarks";

export function generateRevenueReport({
  practiceType,
  callVolume,
  missedPercent,
  patientValue,
}: {
  practiceType: PracticeType;
  callVolume: number;
  missedPercent: number;
  patientValue: number;
}) {
  const benchmark = getBenchmarkProfile(practiceType);

  /*
   * Calculate the number of missed calls
   * using the customer's actual reported
   * missed-call percentage.
   */
  const missedCallsPerMonth = callVolume * (missedPercent / 100);

  /*
   * Dental:
   *
   * Preserve the existing calculation exactly:
   *
   * Missed Calls
   * × 80% Booking Intent
   * × 35% Booking Conversion
   *
   * Specialty/Elective and General Medical:
   *
   * Missed Calls
   * × Group Booking Opportunity Rate
   */
  let lostBookingsPerMonth: number;

  if (
    benchmark.bookingIntentRate !== undefined &&
    benchmark.bookingConversionRate !== undefined
  ) {
    /*
     * Existing Dental calculation.
     */
    lostBookingsPerMonth =
      missedCallsPerMonth *
      benchmark.bookingIntentRate *
      benchmark.bookingConversionRate;
  } else {
    /*
     * Grouped benchmark calculation.
     */
    lostBookingsPerMonth =
      missedCallsPerMonth * benchmark.bookingOpportunityRate;
  }

  /*
   * Estimated revenue opportunity.
   */
  const lostRevenuePerMonth = lostBookingsPerMonth * patientValue;

  const lostRevenuePerYear = lostRevenuePerMonth * 12;

  /*
   * Recovery scenario:
   * assumes approximately 50% of the
   * estimated opportunity could potentially
   * be recovered through improved response,
   * coverage and follow-up.
   */
  const recoveryOpportunity = lostRevenuePerYear * 0.5;

  return {
    practiceType,

    benchmarkGroup: benchmark.benchmarkGroup,

    benchmarkMissedCallRate: benchmark.missedCallRate,

    benchmarkBookingOpportunityRate: benchmark.bookingOpportunityRate,

    missedCallsPerMonth: Math.round(missedCallsPerMonth),

    lostBookingsPerMonth: Math.round(lostBookingsPerMonth),

    monthlyLoss: Math.round(lostRevenuePerMonth),

    yearlyLoss: Math.round(lostRevenuePerYear),

    recoveryOpportunity: Math.round(recoveryOpportunity),

    actions: [
      "Reduce missed call response time below 30 seconds",

      "Add after-hours appointment handling",

      "Track missed-call callback performance weekly",
    ],
  };
}
