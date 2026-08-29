import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

import fs from "fs";

import {
  getBenchmarkProfile,
  PRACTICE_BENCHMARKS,
  type PracticeType,
} from "@/config/benchmarks";

/* -------------------------------------------------------
   BRAND
------------------------------------------------------- */

const BRAND = {
  teal: "#0F7490",
  dark: "#111827",
  text: "#1F2937",
  muted: "#6B7280",
  light: "#F3F4F6",
  lighter: "#F8FAFC",
  border: "#E5E7EB",
  white: "#FFFFFF",
};

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 45,
    paddingHorizontal: 42,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: BRAND.text,
  },

  logo: {
    width: 115,
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 9,
    color: BRAND.teal,
    fontWeight: "bold",
    marginBottom: 7,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 23,
    lineHeight: 1.15,
    fontWeight: "bold",
    color: BRAND.dark,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    color: BRAND.muted,
    marginBottom: 16,
  },

  practice: {
    fontSize: 10,
    color: BRAND.muted,
    marginBottom: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    marginBottom: 9,
  },

  sectionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND.teal,
    color: BRAND.white,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 6,
    marginRight: 8,
  },

  heading: {
    fontSize: 14,
    fontWeight: "bold",
    color: BRAND.dark,
  },

  text: {
    fontSize: 10.5,
    lineHeight: 1.5,
    marginBottom: 8,
  },

  executiveSummary: {
    padding: 17,
    backgroundColor: BRAND.lighter,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 8,
    marginBottom: 18,
  },

  executiveTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: BRAND.teal,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  executiveText: {
    fontSize: 10.5,
    lineHeight: 1.5,
    color: BRAND.text,
  },

  opportunityGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  opportunityCard: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: BRAND.teal,
  },

  opportunityLabel: {
    fontSize: 8.5,
    color: BRAND.white,
    opacity: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  opportunityValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: BRAND.white,
  },

  benchmarkBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 8,
    backgroundColor: BRAND.white,
    marginBottom: 15,
  },

  benchmarkGroup: {
    fontSize: 9,
    color: BRAND.teal,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },

  benchmarkTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: BRAND.dark,
    marginBottom: 10,
  },

  barRow: {
    marginBottom: 11,
  },

  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  barLabel: {
    fontSize: 9,
    color: BRAND.text,
  },

  barValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: BRAND.dark,
  },

  barTrack: {
    width: "100%",
    height: 9,
    backgroundColor: BRAND.light,
    borderRadius: 5,
  },

  barFill: {
    height: 9,
    backgroundColor: BRAND.teal,
    borderRadius: 5,
  },

  benchmarkBarFill: {
    height: 9,
    backgroundColor: BRAND.dark,
    borderRadius: 5,
  },

  note: {
    fontSize: 8.5,
    color: BRAND.muted,
    lineHeight: 1.4,
    marginTop: 8,
  },

  metricGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  metricCard: {
    flex: 1,
    padding: 13,
    backgroundColor: BRAND.light,
    borderRadius: 7,
  },

  metricLabel: {
    fontSize: 8,
    color: BRAND.muted,
    marginBottom: 5,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: BRAND.dark,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  bulletNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAND.teal,
    color: BRAND.white,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 5,
    marginRight: 9,
  },

  bulletContent: {
    flex: 1,
  },

  bulletTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: BRAND.dark,
    marginBottom: 3,
  },

  bulletText: {
    fontSize: 9.5,
    lineHeight: 1.45,
    color: BRAND.text,
  },

  recoveryBox: {
    padding: 17,
    backgroundColor: BRAND.lighter,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 15,
  },

  recoveryLabel: {
    fontSize: 8.5,
    color: BRAND.muted,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  recoveryValue: {
    fontSize: 21,
    fontWeight: "bold",
    color: BRAND.teal,
    marginBottom: 11,
  },

  flowBox: {
    padding: 15,
    backgroundColor: BRAND.light,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 17,
  },

  flowStep: {
    fontSize: 10,
    fontWeight: "bold",
    color: BRAND.dark,
    textAlign: "center",
    marginBottom: 5,
  },

  flowArrow: {
    fontSize: 12,
    color: BRAND.teal,
    textAlign: "center",
    marginBottom: 5,
  },

  /* -----------------------------------------------------
     STRATEGY CALL CTA
  ----------------------------------------------------- */

  salesBox: {
    marginTop: 18,
    padding: 18,
    backgroundColor: BRAND.teal,
    borderRadius: 9,
  },

  salesEyebrow: {
    fontSize: 8.5,
    color: BRAND.white,
    opacity: 0.8,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 6,
  },

  salesTitle: {
    fontSize: 16,
    lineHeight: 1.25,
    color: BRAND.white,
    fontWeight: "bold",
    marginBottom: 7,
  },

  salesText: {
    fontSize: 9.5,
    lineHeight: 1.45,
    color: BRAND.white,
    marginBottom: 12,
  },

  salesButton: {
    backgroundColor: BRAND.dark,
    color: BRAND.white,
    padding: 11,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },

  demoButton: {
    marginTop: 9,
    backgroundColor: BRAND.white,
    color: BRAND.dark,
    padding: 11,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 25,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: BRAND.muted,
  },
});

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function getLogoBase64() {
  const logoPath = process.cwd() + "/public/logo.png";

  const logo = fs.readFileSync(logoPath);

  return `data:image/png;base64,${logo.toString("base64")}`;
}

function formatCurrency(value: number) {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

function getPracticeType(value: string): PracticeType {
  if (value in PRACTICE_BENCHMARKS) {
    return value as PracticeType;
  }

  return "Dental";
}

function getBenchmarkCopy(practiceType: PracticeType) {
  const benchmark = getBenchmarkProfile(practiceType);

  if (benchmark.benchmarkGroup === "Dental") {
    return {
      title: "Where You Likely Stand",

      paragraph:
        "Dental practices can lose meaningful booking opportunities when patient enquiries are missed or follow-up is delayed. Your assessment compares your reported missed-call performance with the benchmark used for this revenue-recovery model.",
    };
  }

  if (benchmark.benchmarkGroup === "Specialty/Elective") {
    return {
      title: "How Specialty & Elective Practices Compare",

      paragraph:
        "Patients considering aesthetic, dermatology and cosmetic services often compare multiple providers before choosing where to book. For this reason, missed enquiries can represent meaningful opportunities to recover potential bookings. Our model uses an estimated 20–25% booking opportunity range for this benchmark group.",
    };
  }

  return {
    title: "How General Medical Practices Compare",

    paragraph:
      "Across general medical settings, missed calls can represent a significant source of lost booking opportunity. This assessment uses an approximately 42% average call-miss benchmark and estimates that around 30% of those missed calls may represent a potential booking opportunity.",
  };
}

/* -------------------------------------------------------
   PDF
------------------------------------------------------- */

export default function RevenueReportPDF({
  data,
  calendlyUrl,
}: {
  data: any;
  calendlyUrl?: string;
}) {
  const logo = getLogoBase64();

  const practiceName = data.practice_name || "Your Practice";

  const practiceType = getPracticeType(data.practice_type);

  const benchmark = getBenchmarkProfile(practiceType);

  const benchmarkCopy = getBenchmarkCopy(practiceType);

  const monthlyOpportunity = Number(data.lost_revenue_monthly || 0);

  const annualOpportunity = Number(data.lost_revenue_yearly || 0);

  const recoveryMonthly = Math.round(monthlyOpportunity * 0.5);

  const recoveryYearly = Math.round(annualOpportunity * 0.5);

  const actualMissedPercent = Number(data.missed_percent || 0);

  const benchmarkMissedPercent = benchmark.missedCallRate * 100;

  const actualBookingRate = benchmark.bookingOpportunityRate * 100;

  const maxBarValue = Math.max(actualMissedPercent, benchmarkMissedPercent, 1);

  const actualBarWidth = Math.min(
    (actualMissedPercent / maxBarValue) * 100,
    100,
  );

  const benchmarkBarWidth = Math.min(
    (benchmarkMissedPercent / maxBarValue) * 100,
    100,
  );

  /*
   * -----------------------------------------------------
   * PUBLIC URLS
   * -----------------------------------------------------
   *
   * .env.local
   *
   * NEXT_PUBLIC_APP_URL=http://localhost:3000
   *
   * NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session
   */

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const strategyCallUrl =
    calendlyUrl ||
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session";

  const demoPageUrl = `${appUrl.replace(/\/$/, "")}/ai-receptionist-demo`;

  const practiceTitle = `${practiceType} Practice Revenue Recovery Assessment`;

  return (
    <Document>
      {/* =================================================
          PAGE 1 — EXECUTIVE SUMMARY
      ================================================= */}

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.logo} />

        <Text style={styles.eyebrow}>Revenue Recovery Assessment</Text>

        <Text style={styles.title}>{practiceTitle}</Text>

        <Text style={styles.subtitle}>
          Prepared specifically for your practice
        </Text>

        <Text style={styles.practice}>
          Prepared for:{" "}
          <Text
            style={{
              fontWeight: "bold",
              color: BRAND.dark,
            }}
          >
            {practiceName}
          </Text>
        </Text>

        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Executive Summary</Text>

          <Text style={styles.executiveText}>
            Based on the information you provided, your practice has an
            estimated revenue opportunity associated with missed patient
            enquiries. The assessment indicates approximately{" "}
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {formatCurrency(monthlyOpportunity)}
            </Text>{" "}
            in potential monthly revenue opportunity, or{" "}
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {formatCurrency(annualOpportunity)}
            </Text>{" "}
            annually.
          </Text>
        </View>

        <View style={styles.opportunityGrid}>
          <View style={styles.opportunityCard}>
            <Text style={styles.opportunityLabel}>Monthly Opportunity</Text>

            <Text style={styles.opportunityValue}>
              {formatCurrency(monthlyOpportunity)}
            </Text>
          </View>

          <View style={styles.opportunityCard}>
            <Text style={styles.opportunityLabel}>Annual Opportunity</Text>

            <Text style={styles.opportunityValue}>
              {formatCurrency(annualOpportunity)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>1</Text>

          <Text style={styles.heading}>How This Was Calculated</Text>
        </View>

        <Text style={styles.text}>
          Your estimate uses your reported monthly call volume, missed-call
          percentage and average patient value. We then apply the benchmark
          assumptions associated with the {benchmark.benchmarkGroup} group to
          estimate the potential booking opportunity represented by missed
          patient enquiries.
        </Text>

        <Text style={styles.text}>
          These figures are estimates rather than guaranteed revenue. They are
          intended to show the financial significance of missed enquiries and
          provide a practical basis for improving response and follow-up.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>2</Text>

          <Text style={styles.heading}>Benchmark Comparison</Text>
        </View>

        <View style={styles.benchmarkBox}>
          <Text style={styles.benchmarkGroup}>{benchmark.benchmarkGroup}</Text>

          <Text style={styles.benchmarkTitle}>
            Your Missed-Call Rate vs. Benchmark
          </Text>

          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Your reported rate</Text>

              <Text style={styles.barValue}>{actualMissedPercent}%</Text>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${actualBarWidth}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Industry benchmark</Text>

              <Text style={styles.barValue}>{benchmarkMissedPercent}%</Text>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.benchmarkBarFill,
                  {
                    width: `${benchmarkBarWidth}%`,
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.note}>
            Benchmark values are grouped industry estimates used for modelling
            and comparison. They should not be interpreted as a guarantee or
            prediction of actual practice performance.
          </Text>
        </View>
      </Page>

      {/* =================================================
          PAGE 2 — REVENUE OPPORTUNITY
      ================================================= */}

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.logo} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>3</Text>

          <Text style={styles.heading}>{benchmarkCopy.title}</Text>
        </View>

        <Text style={styles.text}>{benchmarkCopy.paragraph}</Text>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Monthly Calls</Text>

            <Text style={styles.metricValue}>
              {Number(data.call_volume || 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Missed Calls</Text>

            <Text style={styles.metricValue}>
              {Number(data.missed_percent || 0)}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Patient Value</Text>

            <Text style={styles.metricValue}>
              {formatCurrency(Number(data.avg_patient_value || 0))}
            </Text>
          </View>
        </View>

        <View style={styles.benchmarkBox}>
          <Text style={styles.benchmarkGroup}>Booking Opportunity Model</Text>

          <Text style={styles.benchmarkTitle}>
            Estimated booking opportunity: {actualBookingRate}%
          </Text>

          <Text style={styles.text}>
            This percentage represents the benchmark assumption used to estimate
            how many missed patient enquiries could represent a potential
            booking opportunity.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>4</Text>

          <Text style={styles.heading}>What You Could Recover</Text>
        </View>

        <View style={styles.recoveryBox}>
          <Text style={styles.recoveryLabel}>Estimated monthly recovery</Text>

          <Text style={styles.recoveryValue}>
            {formatCurrency(recoveryMonthly)}
            /month
          </Text>

          <Text style={styles.recoveryLabel}>Estimated annual recovery</Text>

          <Text style={styles.recoveryValue}>
            {formatCurrency(recoveryYearly)}
            /year
          </Text>
        </View>

        <Text style={styles.text}>
          This recovery scenario assumes that better response, after-hours
          coverage and follow-up could recover approximately half of the
          estimated opportunity. It is an improvement scenario, not guaranteed
          revenue.
        </Text>
      </Page>

      {/* =================================================
          PAGE 3 — ACTION PLAN
      ================================================= */}

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.logo} />

        <Text style={styles.eyebrow}>Recovery Action Plan</Text>

        <Text style={styles.title}>Three Actions Worth Taking This Month</Text>

        <Text
          style={{
            ...styles.subtitle,
            marginBottom: 20,
          }}
        >
          Focus on the points in the patient journey where missed enquiries
          become lost opportunities.
        </Text>

        <View style={styles.bulletRow}>
          <Text style={styles.bulletNumber}>1</Text>

          <View style={styles.bulletContent}>
            <Text style={styles.bulletTitle}>Reduce response time</Text>

            <Text style={styles.bulletText}>
              Reduce missed-call response time below 30 seconds. The longer
              patients wait, the greater the opportunity for them to contact
              another provider.
            </Text>
          </View>
        </View>

        <View style={styles.bulletRow}>
          <Text style={styles.bulletNumber}>2</Text>

          <View style={styles.bulletContent}>
            <Text style={styles.bulletTitle}>Add after-hours handling</Text>

            <Text style={styles.bulletText}>
              Capture patient enquiries that arrive outside normal office hours
              instead of allowing those opportunities to disappear.
            </Text>
          </View>
        </View>

        <View style={styles.bulletRow}>
          <Text style={styles.bulletNumber}>3</Text>

          <View style={styles.bulletContent}>
            <Text style={styles.bulletTitle}>Track callback performance</Text>

            <Text style={styles.bulletText}>
              Track missed-call callback performance weekly and measure how many
              missed enquiries receive same-day follow-up.
            </Text>
          </View>
        </View>

        <View style={styles.benchmarkBox}>
          <Text style={styles.benchmarkGroup}>What to monitor</Text>

          <Text style={styles.benchmarkTitle}>
            Missed calls → callbacks → bookings
          </Text>

          <Text style={styles.text}>
            The objective is not simply to reduce the number of missed calls. It
            is to build a reliable process that turns missed patient enquiries
            into timely follow-up and potential bookings.
          </Text>
        </View>
      </Page>

      {/* =================================================
          PAGE 4 — STRATEGY CALL CTA
      ================================================= */}

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.logo} />

        <Text style={styles.eyebrow}>Next Step</Text>

        <Text style={styles.title}>
          Turn More Missed Enquiries Into Patient Opportunities
        </Text>

        <Text style={styles.text}>
          Your assessment identified a potential revenue opportunity created by
          missed patient enquiries. The next step is to understand what a
          practical revenue recovery system could look like for your practice.
        </Text>

        <View style={styles.flowBox}>
          <Text style={styles.flowStep}>Patient calls</Text>

          <Text style={styles.flowArrow}>↓</Text>

          <Text style={styles.flowStep}>AI receptionist responds</Text>

          <Text style={styles.flowArrow}>↓</Text>

          <Text style={styles.flowStep}>Patient information captured</Text>

          <Text style={styles.flowArrow}>↓</Text>

          <Text style={styles.flowStep}>Booking opportunity created</Text>
        </View>

        {/* =================================================
            PRIMARY STRATEGY CALL CTA
        ================================================= */}

        <View style={styles.salesBox}>
          <Text style={styles.salesEyebrow}>READY TO ACT ON YOUR RESULTS?</Text>

          <Text style={styles.salesTitle}>
            Book a Free Revenue Recovery Strategy Call
          </Text>

          <Text style={styles.salesText}>
            Your report shows where missed enquiries may be creating a revenue
            gap. On a free strategy call, we can look at your results, discuss
            your current call-handling process and identify where an AI revenue
            recovery system could fit.
          </Text>

          <Link src={strategyCallUrl} style={styles.salesButton}>
            Book a Free Strategy Call →
          </Link>

          <Link src={demoPageUrl} style={styles.demoButton}>
            Watch AI Receptionist Demo →
          </Link>
        </View>

        {/* =================================================
            FOUNDER
        ================================================= */}

        <View style={styles.footer}>
          <Text
            style={{
              fontWeight: "bold",
              color: BRAND.dark,
              marginBottom: 4,
            }}
          >
            Prepared by
          </Text>

          <Text>Cleavon A</Text>

          <Text>Founder & AI Revenue Recovery Consultant</Text>

          <Text>Skill Digital Solutions</Text>

          <Text
            style={{
              marginTop: 9,
            }}
          >
            Helping practices recover missed patient opportunities through
            better response, follow-up and AI-powered call handling systems.
          </Text>

          <Text
            style={{
              marginTop: 9,
            }}
          >
            Questions about your results? Reply directly to the email that
            delivered this report.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
