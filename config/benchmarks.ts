export type PracticeType =
  | "Dental"
  | "Aesthetics Clinic"
  | "Dermatology"
  | "Cosmetic Clinic"
  | "Physiotherapy"
  | "Optometry"
  | "Private Hospital";

export type BenchmarkGroup =
  | "Dental"
  | "Specialty/Elective"
  | "General Medical";

export type BenchmarkProfile = {
  benchmarkGroup: BenchmarkGroup;

  /**
   * Used for benchmark comparison in the report.
   */
  missedCallRate: number;

  /**
   * Used to estimate potential booking opportunities.
   */
  bookingOpportunityRate: number;

  /**
   * Dental's existing calculation model uses
   * two separate rates:
   *
   * missed calls
   * × booking intent
   * × booking conversion
   *
   * These are optional because the newer grouped
   * benchmark model does not require them.
   */
  bookingIntentRate?: number;

  bookingConversionRate?: number;
};

/**
 * Benchmark profiles
 *
 * Dental:
 * Existing calculation behaviour is preserved.
 *
 * Specialty/Elective:
 * Grouped benchmark for:
 * - Aesthetics Clinic
 * - Dermatology
 * - Cosmetic Clinic
 *
 * General Medical:
 * Grouped benchmark for:
 * - Physiotherapy
 * - Optometry
 * - Private Hospital
 */
export const BENCHMARK_GROUPS: Record<BenchmarkGroup, BenchmarkProfile> = {
  Dental: {
    benchmarkGroup: "Dental",

    /*
     * Existing dental benchmark used for
     * benchmark comparison.
     */
    missedCallRate: 0.2,

    /*
     * Existing dental calculation:
     *
     * 80% booking intent
     * × 35% booking conversion
     */
    bookingOpportunityRate: 0.35,

    bookingIntentRate: 0.8,

    bookingConversionRate: 0.35,
  },

  "Specialty/Elective": {
    benchmarkGroup: "Specialty/Elective",

    /*
     * Conservative grouped benchmark.
     */
    missedCallRate: 0.3,

    /*
     * Estimated booking opportunity
     * used by the grouped model.
     */
    bookingOpportunityRate: 0.25,
  },

  "General Medical": {
    benchmarkGroup: "General Medical",

    /*
     * Agreed general-medical benchmark.
     */
    missedCallRate: 0.42,

    /*
     * Estimated booking opportunity
     * used by the grouped model.
     */
    bookingOpportunityRate: 0.3,
  },
};

/**
 * Maps each selectable practice type
 * to its benchmark group.
 */
export const PRACTICE_BENCHMARKS: Record<PracticeType, BenchmarkGroup> = {
  Dental: "Dental",

  "Aesthetics Clinic": "Specialty/Elective",

  Dermatology: "Specialty/Elective",

  "Cosmetic Clinic": "Specialty/Elective",

  Physiotherapy: "General Medical",

  Optometry: "General Medical",

  "Private Hospital": "General Medical",
};

/**
 * Returns the benchmark profile for
 * a selected practice type.
 */
export function getBenchmarkProfile(
  practiceType: PracticeType,
): BenchmarkProfile {
  const benchmarkGroup = PRACTICE_BENCHMARKS[practiceType];

  return BENCHMARK_GROUPS[benchmarkGroup];
}
