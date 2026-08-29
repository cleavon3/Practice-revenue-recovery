"use client";

import { useEffect, useState } from "react";

type PracticeCopy = {
  title: string;
  description: string;
  benchmark: string;
};

type ReportStatus = {
  practiceName: string | null;
  practiceType: string | null;
  reportPurchased: boolean;
  reportGenerated: boolean;
  reportUrl: string | null;
  reportGeneratedAt: string | null;
};

const CALENDLY_URL =
  "https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session";

const PRACTICE_COPY: Record<string, PracticeCopy> = {
  Dental: {
    title: "Dental Revenue Recovery Report",
    description:
      "Your personalised dental revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your practice revenue and where recovery opportunities exist.",
    benchmark: "Dental industry benchmark comparison",
  },

  "Aesthetics Clinic": {
    title: "Aesthetics Clinic Revenue Recovery Report",
    description:
      "Your personalised aesthetics revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your clinic revenue and where recovery opportunities exist.",
    benchmark: "Specialty/Elective benchmark comparison",
  },

  Dermatology: {
    title: "Dermatology Revenue Recovery Report",
    description:
      "Your personalised dermatology revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your practice revenue and where recovery opportunities exist.",
    benchmark: "Specialty/Elective benchmark comparison",
  },

  "Cosmetic Clinic": {
    title: "Cosmetic Clinic Revenue Recovery Report",
    description:
      "Your personalised cosmetic clinic revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your clinic revenue and where recovery opportunities exist.",
    benchmark: "Specialty/Elective benchmark comparison",
  },

  Physiotherapy: {
    title: "Physiotherapy Revenue Recovery Report",
    description:
      "Your personalised physiotherapy revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your practice revenue and where recovery opportunities exist.",
    benchmark: "General Medical benchmark comparison",
  },

  Optometry: {
    title: "Optometry Revenue Recovery Report",
    description:
      "Your personalised optometry revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your practice revenue and where recovery opportunities exist.",
    benchmark: "General Medical benchmark comparison",
  },

  "Private Hospital": {
    title: "Private Hospital Revenue Recovery Report",
    description:
      "Your personalised private hospital revenue assessment has been completed. Your report highlights where missed patient enquiries may be costing your facility revenue and where recovery opportunities exist.",
    benchmark: "General Medical benchmark comparison",
  },
};

const DEFAULT_COPY: PracticeCopy = {
  title: "Revenue Recovery Report",
  description:
    "Your personalised revenue recovery assessment has been completed. Your report highlights where missed patient enquiries may be costing your practice revenue and where recovery opportunities exist.",
  benchmark: "Relevant industry benchmark comparison",
};

export default function ReportSuccessPage() {
  const [sessionId, setSessionId] = useState("");

  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Get Stripe session ID from URL.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const id = params.get("session_id");

    if (!id) {
      console.error("❌ NO SESSION ID");

      setError("We could not identify your payment session.");

      setLoading(false);

      return;
    }

    setSessionId(id);

    console.log("✅ PAYMENT SUCCESS PAGE LOADED:", id);
  }, []);

  /*
   * Poll the server until the Stripe webhook
   * has generated the report.
   */
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function fetchReportStatus() {
      try {
        const response = await fetch(
          `/api/report-status?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to retrieve report status.");
        }

        if (cancelled) {
          return;
        }

        setReportStatus(data);

        /*
         * The webhook may still be processing
         * the payment and generating the PDF.
         */
        if (!data.reportGenerated) {
          timeoutId = setTimeout(fetchReportStatus, 2000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ REPORT STATUS ERROR:", error);

        if (!cancelled) {
          setError(
            "We could not retrieve your report status. Please check your email for your report.",
          );

          setLoading(false);
        }
      }
    }

    fetchReportStatus();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sessionId]);

  /*
   * Open the generated PDF.
   */
  function handleReportClick() {
    if (!reportStatus?.reportUrl) {
      return;
    }

    window.open(reportStatus.reportUrl, "_blank", "noopener,noreferrer");
  }

  /*
   * Open Calendly strategy-call booking.
   */
  function handleStrategyCallClick() {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }

  /*
   * Open AI receptionist demo.
   */
  function handleDemoClick() {
    window.location.href = "/ai-receptionist-demo";
  }

  const practiceType = reportStatus?.practiceType || "";

  const copy = PRACTICE_COPY[practiceType] || DEFAULT_COPY;

  const reportReady = reportStatus?.reportGenerated === true;

  const reportAvailable = reportReady && Boolean(reportStatus?.reportUrl);

  return (
    <main>
      <div className="container">
        <section className="report-success premium-success">
          {/* Payment Status */}

          <div className="success-badge">✓ Payment Successful</div>

          {/* Main Heading */}

          <h1>{copy.title}</h1>

          <p className="subtitle">{copy.description}</p>

          {/* Report Section */}

          <div className="report-box">
            <h2>
              {reportReady
                ? "Your Report Is Ready"
                : "Your Report Is Being Prepared"}
            </h2>

            <ul>
              <li>Missed-call revenue opportunity analysis</li>

              <li>{copy.benchmark}</li>

              <li>Revenue recovery opportunities</li>

              <li>Practical actions to improve patient enquiry capture</li>

              <li>AI receptionist strategy assessment</li>
            </ul>

            {/* Preparing */}

            {loading && !reportReady && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  borderRadius: "10px",
                  background: "#f3f4f6",
                  color: "#4b5563",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                We're preparing your personalised report. This usually takes a
                few moments.
              </div>
            )}

            {/* Report Ready */}

            {reportReady && (
              <p className="report-status">
                Your personalised report has been prepared successfully.
              </p>
            )}

            {/* Error */}

            {error && (
              <p className="report-status" role="alert">
                {error}
              </p>
            )}

            {/* View Full Report */}

            {reportAvailable && (
              <div
                style={{
                  marginTop: "28px",
                }}
              >
                <button
                  type="button"
                  onClick={handleReportClick}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    border: "none",
                    borderRadius: "12px",
                    background: "#111827",
                    color: "#ffffff",
                    fontSize: "17px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  }}
                >
                  View My Full Report →
                </button>

                <p
                  style={{
                    marginTop: "10px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  Your personalised PDF report is ready to view.
                </p>
              </div>
            )}
          </div>

          {/* Strategy Call */}

          <div
            className="cta-box demo-next-box"
            style={{
              marginTop: "32px",
            }}
          >
            <h2>Ready to Recover More Missed Revenue?</h2>

            <p>
              Your report shows the potential revenue opportunity created by
              missed enquiries. If you want to discuss what this could look like
              for your practice, book a free strategy call.
            </p>

            <button
              type="button"
              onClick={handleStrategyCallClick}
              className="demo-next-button"
              style={{
                background: "#111827",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Book a Free Strategy Call →
            </button>
          </div>

          {/* AI Receptionist Demo */}

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                marginBottom: "10px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Want to see the technology first?
            </p>

            <button
              type="button"
              onClick={handleDemoClick}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                color: "#111827",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Watch the AI Receptionist Demo →
            </button>
          </div>

          {/* Payment Reference */}

          {sessionId && (
            <p
              style={{
                marginTop: "28px",
                fontSize: "11px",
                color: "#9ca3af",
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              Payment reference: {sessionId}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
