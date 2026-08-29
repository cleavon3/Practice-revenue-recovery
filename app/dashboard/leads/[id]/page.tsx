"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lead = {
  id: string;
  created_at: string;
  session_id: string;

  email: string | null;
  practice_name: string | null;
  practice_type: string | null;
  industry: string | null;

  call_volume: number | null;
  missed_percent: number | null;
  avg_patient_value: number | null;

  lost_revenue_monthly: number | null;
  lost_revenue_yearly: number | null;

  calculator_completed: boolean;
  report_purchased: boolean;
  report_generated: boolean;

  email_captured: boolean;

  booking_cta_clicked: boolean;
  booking_clicked_at: string | null;

  report_url: string | null;
  report_generated_at: string | null;

  status: string | null;
};

const STATUS_OPTIONS = [
  {
    value: "new",
    label: "New Lead",
  },
  {
    value: "report_paid",
    label: "Report Purchased",
  },
  {
    value: "call_booked",
    label: "Strategy Call Booked",
  },
  {
    value: "proposal_sent",
    label: "Proposal Sent",
  },
  {
    value: "client",
    label: "Client Won",
  },
  {
    value: "lost",
    label: "Lost",
  },
];

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session";

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("new");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    loadLead();
  }, [id]);

  async function loadLead() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/dashboard/leads/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Lead not found");
      }

      setLead(data.lead);

      setStatus(data.lead?.status || "new");
    } catch (error) {
      console.error("❌ LEAD DETAILS ERROR:", error);

      setError(error instanceof Error ? error.message : "Could not load lead.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    if (!lead) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`/api/dashboard/leads/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not update status.");
      }

      setLead(data.lead);

      setStatus(data.lead?.status || status);

      setMessage("CRM status updated successfully.");
    } catch (error) {
      console.error("❌ STATUS UPDATE ERROR:", error);

      setError(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  function openReport() {
    if (!lead?.report_url) {
      return;
    }

    window.open(lead.report_url, "_blank", "noopener,noreferrer");
  }

  function bookStrategyCall() {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }

  const journey = useMemo(() => {
    if (!lead) {
      return [];
    }

    return [
      {
        label: "Assessment Completed",
        completed: lead.calculator_completed,
      },
      {
        label: "Email Captured",
        completed: lead.email_captured,
      },
      {
        label: "Report Purchased",
        completed: lead.report_purchased,
      },
      {
        label: "PDF Generated",
        completed: lead.report_generated,
      },
      {
        label: "Strategy Call Booked",
        completed: lead.booking_cta_clicked || lead.status === "call_booked",
      },
      {
        label: "Client Won",
        completed: lead.status === "client",
      },
    ];
  }, [lead]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f7f9]">
        <div className="mx-auto flex min-h-screen max-w-[1400px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F7490]" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading lead profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !lead) {
    return (
      <main className="min-h-screen bg-[#f4f7f9] px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-6 text-sm font-semibold text-[#0F7490]"
          >
            ← Back to Dashboard
          </button>

          <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Lead could not be loaded
            </h1>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              type="button"
              onClick={loadLead}
              className="mt-6 rounded-xl bg-[#101828] px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!lead) {
    return null;
  }

  const monthlyOpportunity = Number(lead.lost_revenue_monthly || 0);

  const annualOpportunity = Number(lead.lost_revenue_yearly || 0);

  const patientValue = Number(lead.avg_patient_value || 0);

  const callVolume = Number(lead.call_volume || 0);

  const missedPercent = Number(lead.missed_percent || 0);

  const completedJourneySteps = journey.filter((item) => item.completed).length;

  return (
    <main className="min-h-screen bg-[#f4f7f9]">
      <div className="mx-auto max-w-[1450px] px-5 py-6 sm:px-8 lg:px-10">
        {/* TOP NAV */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex w-fit items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#0F7490]"
          >
            <span className="text-lg">←</span>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0F7490]" />

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
              Lead Profile
            </span>
          </div>
        </div>

        {/* HERO */}

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-[#0b1720] px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0F7490] text-2xl font-bold text-white shadow-lg">
                  {getInitial(lead.practice_name)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={lead.status || "new"} />

                    {lead.practice_type && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
                        {lead.practice_type}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {lead.practice_name || "Unknown Practice"}
                  </h1>

                  <p className="mt-1 truncate text-sm text-white/50">
                    {lead.email || "No email captured"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {lead.report_url && (
                  <button
                    type="button"
                    onClick={openReport}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#101828] shadow-sm transition hover:bg-gray-100"
                  >
                    View Report
                  </button>
                )}

                <button
                  type="button"
                  onClick={bookStrategyCall}
                  className="rounded-xl bg-[#0F7490] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c637b]"
                >
                  Book Strategy Call
                </button>
              </div>
            </div>
          </div>

          {/* LEAD META */}

          <div className="grid divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <MetaItem
              label="Lead Created"
              value={formatDate(lead.created_at)}
            />

            <MetaItem
              label="Industry Group"
              value={lead.industry || "Not specified"}
            />

            <MetaItem label="Session ID" value={lead.session_id} mono />
          </div>
        </section>

        {/* ALERTS */}

        {(message || error) && (
          <div
            className={`
              mt-5 rounded-2xl border px-5 py-4 text-sm font-medium
              ${
                error
                  ? "border-red-100 bg-red-50 text-red-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }
            `}
            role="alert"
          >
            {error || message}
          </div>
        )}

        {/* REVENUE OVERVIEW */}

        <section className="mt-7">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
              Revenue Intelligence
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Opportunity Overview
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <RevenueMetric
              label="Monthly Opportunity"
              value={`$${monthlyOpportunity.toLocaleString()}`}
              description="Estimated recoverable monthly revenue"
              primary
            />

            <RevenueMetric
              label="Annual Opportunity"
              value={`$${annualOpportunity.toLocaleString()}`}
              description="Estimated annual revenue opportunity"
            />

            <RevenueMetric
              label="New Patient Value"
              value={`$${patientValue.toLocaleString()}`}
              description="Average value of a new patient booking"
            />
          </div>
        </section>

        {/* MAIN GRID */}

        <section className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* ASSESSMENT DATA */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
                  Assessment
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Lead Inputs
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  The information submitted by this practice.
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <DataCard
                  label="Monthly Enquiries"
                  value={callVolume.toLocaleString()}
                  suffix="calls"
                />

                <DataCard
                  label="Missed Enquiries"
                  value={`${missedPercent}%`}
                  suffix="estimated"
                />

                <DataCard
                  label="Patient Value"
                  value={`$${patientValue.toLocaleString()}`}
                  suffix="per booking"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8fafb] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Estimated missed enquiries
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Based on monthly enquiry volume and missed-call
                      percentage.
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-[#0F7490]">
                    {Math.round(
                      callVolume * (missedPercent / 100),
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* CUSTOMER JOURNEY */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
                    Customer Journey
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Lead Progress
                  </h2>
                </div>

                <p className="text-xs font-semibold text-gray-400">
                  {completedJourneySteps} of {journey.length} stages completed
                </p>
              </div>

              <div className="mt-7">
                {journey.map((item, index) => (
                  <JourneyStep
                    key={item.label}
                    label={item.label}
                    completed={item.completed}
                    isLast={index === journey.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* CRM STATUS */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
                CRM
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Lead Status
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Update where this prospect currently sits in your sales process.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="lead-status"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Current Status
                </label>

                <select
                  id="lead-status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setMessage("");
                    setError("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#0F7490] focus:bg-white focus:ring-4 focus:ring-[#0F7490]/10"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={updateStatus}
                  disabled={saving}
                  className="mt-3 w-full rounded-xl bg-[#101828] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#172033] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save CRM Status"}
                </button>
              </div>
            </div>

            {/* REPORT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
                Report
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Revenue Recovery Report
              </h2>

              <div className="mt-6 rounded-2xl bg-[#f8fafb] p-5">
                <ReportStatus
                  label="Purchased"
                  completed={lead.report_purchased}
                />

                <ReportStatus
                  label="PDF Generated"
                  completed={lead.report_generated}
                />

                <ReportStatus
                  label="Email Captured"
                  completed={lead.email_captured}
                />
              </div>

              {lead.report_url ? (
                <button
                  type="button"
                  onClick={openReport}
                  className="mt-4 w-full rounded-xl border-2 border-[#0F7490] px-4 py-3 text-sm font-semibold text-[#0F7490] transition hover:bg-[#e8f5f8]"
                >
                  Open PDF Report →
                </button>
              ) : (
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Report URL is not currently available.
                </div>
              )}
            </div>

            {/* STRATEGY CALL */}

            <div className="overflow-hidden rounded-3xl bg-[#0b1720] p-6 shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F7490] text-lg text-white">
                ◷
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Strategy Call
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Move this lead toward a strategy conversation about recovering
                missed revenue.
              </p>

              <div className="mt-5">
                {lead.booking_cta_clicked || lead.status === "call_booked" ? (
                  <div className="rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                    ✓ Strategy call booked
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={bookStrategyCall}
                    className="w-full rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-[#101828] transition hover:bg-gray-100"
                  >
                    Open Calendly →
                  </button>
                )}
              </div>

              {lead.booking_clicked_at && (
                <p className="mt-3 text-xs text-white/35">
                  Booked {formatDateTime(lead.booking_clicked_at)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CONTACT / RECORD INFORMATION */}

        <section className="mt-7 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
              Lead Record
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Contact & Record Information
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              label="Practice Name"
              value={lead.practice_name || "Not provided"}
            />

            <InfoItem
              label="Practice Type"
              value={lead.practice_type || "Not provided"}
            />

            <InfoItem
              label="Email Address"
              value={lead.email || "Not captured"}
            />

            <InfoItem
              label="Industry"
              value={lead.industry || "Not specified"}
            />
          </div>
        </section>

        {/* BOTTOM */}

        <div className="mt-7 flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-fit text-sm font-semibold text-gray-500 transition hover:text-[#0F7490]"
          >
            ← Return to Lead Database
          </button>

          <p className="text-xs text-gray-400">
            Lead ID: <span className="font-mono">{lead.id}</span>
          </p>
        </div>
      </div>
    </main>
  );
}

/* ======================================================
   COMPONENTS
====================================================== */

function RevenueMetric({
  label,
  value,
  description,
  primary = false,
}: {
  label: string;
  value: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`
        rounded-3xl border p-6 shadow-sm
        ${
          primary ? "border-[#0F7490] bg-[#0F7490]" : "border-gray-200 bg-white"
        }
      `}
    >
      <p
        className={
          primary
            ? "text-sm font-semibold text-white/70"
            : "text-sm font-semibold text-gray-500"
        }
      >
        {label}
      </p>

      <p
        className={`
          mt-4 text-3xl font-bold tracking-tight
          ${primary ? "text-white" : "text-gray-900"}
        `}
      >
        {value}
      </p>

      <p
        className={`
          mt-2 text-xs leading-5
          ${primary ? "text-white/60" : "text-gray-400"}
        `}
      >
        {description}
      </p>
    </div>
  );
}

function DataCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-semibold text-gray-400">{label}</p>

      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">{suffix}</p>
    </div>
  );
}

function MetaItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-6 py-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      <p
        className={`
          mt-2 truncate text-sm font-semibold text-gray-800
          ${mono ? "font-mono text-xs" : ""}
        `}
      >
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fafb] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function ReportStatus({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {completed ? (
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          Complete
        </span>
      ) : (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-400">
          Pending
        </span>
      )}
    </div>
  );
}

function JourneyStep({
  label,
  completed,
  isLast,
}: {
  label: string;
  completed: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold
            ${
              completed
                ? "bg-[#0F7490] text-white"
                : "border-2 border-gray-200 bg-white text-gray-300"
            }
          `}
        >
          {completed ? "✓" : "○"}
        </div>

        {!isLast && (
          <div
            className={`
              mt-2 h-8 w-px
              ${completed ? "bg-[#0F7490]/30" : "bg-gray-200"}
            `}
          />
        )}
      </div>

      <div className="pt-1">
        <p
          className={`
            text-sm font-semibold
            ${completed ? "text-gray-900" : "text-gray-400"}
          `}
        >
          {label}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {completed ? "Completed" : "Not completed"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    new: "New Lead",
    report_paid: "Report Purchased",
    call_booked: "Strategy Call Booked",
    proposal_sent: "Proposal Sent",
    client: "Client Won",
    lost: "Lost",
  };

  const label = labels[status] || status;

  const positive =
    status === "report_paid" || status === "call_booked" || status === "client";

  const negative = status === "lost";

  return (
    <span
      className={`
        rounded-full px-3 py-1 text-[11px] font-semibold
        ${
          positive
            ? "bg-emerald-400/10 text-emerald-300"
            : negative
              ? "bg-red-400/10 text-red-300"
              : "bg-white/10 text-white/70"
        }
      `}
    >
      {label}
    </span>
  );
}

/* ======================================================
   HELPERS
====================================================== */

function getInitial(name: string | null) {
  if (!name) {
    return "L";
  }

  return name.trim().charAt(0).toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
