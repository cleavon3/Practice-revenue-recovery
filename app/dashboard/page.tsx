"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const PIPELINE = [
  { value: "new", label: "New Lead" },
  { value: "report_paid", label: "Report Purchased" },
  { value: "call_booked", label: "Call Booked" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "client", label: "Client Won" },
  { value: "lost", label: "Lost" },
];

const PRACTICE_TYPES = [
  "Dental",
  "Aesthetics Clinic",
  "Dermatology",
  "Cosmetic Clinic",
  "Physiotherapy",
  "Optometry",
  "Private Hospital",
];

export default function DashboardPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState<"overview" | "pipeline">("overview");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [practiceFilter, setPracticeFilter] = useState("all");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not load dashboard.");
      }

      setLeads(data.leads || []);
    } catch (err) {
      console.error("DASHBOARD LOAD ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Could not load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const { supabase } = await import("@/lib/supabase");

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        [
          lead.practice_name,
          lead.email,
          lead.practice_type,
          lead.industry,
          lead.session_id,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" || (lead.status || "new") === statusFilter;

      const matchesPractice =
        practiceFilter === "all" || lead.practice_type === practiceFilter;

      return matchesSearch && matchesStatus && matchesPractice;
    });
  }, [leads, search, statusFilter, practiceFilter]);

  const metrics = useMemo(() => {
    const monthly = leads.reduce(
      (sum, lead) => sum + Number(lead.lost_revenue_monthly || 0),
      0,
    );

    const annual = leads.reduce(
      (sum, lead) => sum + Number(lead.lost_revenue_yearly || 0),
      0,
    );

    return {
      total: leads.length,
      monthly,
      annual,
      purchased: leads.filter((lead) => lead.report_purchased).length,
      booked: leads.filter(
        (lead) => lead.booking_cta_clicked || lead.status === "call_booked",
      ).length,
      clients: leads.filter((lead) => lead.status === "client").length,
    };
  }, [leads]);

  const pipelineLeads = useMemo(() => {
    return PIPELINE.map((stage) => ({
      ...stage,
      leads: leads.filter((lead) => (lead.status || "new") === stage.value),
    }));
  }, [leads]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPracticeFilter("all");
  }

  return (
    <main className="min-h-screen bg-[#f6f9fb] text-[#172033]">
      <div className="mx-auto max-w-[1550px] px-5 py-7 sm:px-8 lg:px-10">
        {/* HEADER */}

        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0F7490]" />

                <span className="text-sm font-bold tracking-[0.18em] text-[#8795aa]">
                  SKILL DIGITAL SOLUTIONS
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Revenue Recovery Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#718096]">
                Monitor leads, revenue opportunities, purchases and
                strategy-call activity.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadLeads}
                className="rounded-xl border border-[#dce3e8] bg-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-[#f8fafb]"
              >
                ↻ Refresh
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-[#111b2d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b2940]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* TOP METRICS */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="Total Leads"
            value={metrics.total.toLocaleString()}
            description="Assessment submissions"
          />

          <Metric
            title="Monthly Opportunity"
            value={money(metrics.monthly)}
            description="Estimated monthly recovery"
            primary
          />

          <Metric
            title="Reports Purchased"
            value={metrics.purchased.toLocaleString()}
            description="Paid reports"
          />

          <Metric
            title="Strategy Calls"
            value={metrics.booked.toLocaleString()}
            description="Booking activity"
          />
        </section>

        {/* SECONDARY */}

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          <SmallMetric
            title="Annual Opportunity"
            value={money(metrics.annual)}
          />

          <SmallMetric
            title="Clients Won"
            value={metrics.clients.toLocaleString()}
          />

          <SmallMetric
            title="Database"
            value={`${filteredLeads.length} leads visible`}
          />
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* MAIN CRM */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#e1e7eb] bg-white shadow-[0_4px_25px_rgba(16,24,40,0.04)]">
          {/* TOOLBAR */}

          <div className="border-b border-[#edf1f3] px-6 py-6 lg:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0F7490]">
                  CRM
                </p>

                <h2 className="mt-1 text-xl font-bold">Lead Management</h2>
              </div>

              {/* VIEW SWITCH */}

              <div className="flex rounded-xl border border-[#dce3e8] bg-[#f8fafb] p-1">
                <button
                  onClick={() => setView("overview")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    view === "overview"
                      ? "bg-white text-[#0F7490] shadow-sm"
                      : "text-[#718096]"
                  }`}
                >
                  Overview
                </button>

                <button
                  onClick={() => setView("pipeline")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    view === "pipeline"
                      ? "bg-white text-[#0F7490] shadow-sm"
                      : "text-[#718096]"
                  }`}
                >
                  Pipeline
                </button>
              </div>
            </div>
          </div>

          {/* OVERVIEW */}

          {view === "overview" && (
            <>
              <div className="border-b border-[#edf1f3] px-6 py-5 lg:px-7">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads..."
                    className="h-11 flex-1 rounded-xl border border-[#dce3e8] px-4 text-sm outline-none focus:border-[#0F7490] focus:ring-4 focus:ring-[#0F7490]/10"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-[#dce3e8] px-4 text-sm font-semibold outline-none"
                  >
                    <option value="all">All statuses</option>

                    {PIPELINE.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={practiceFilter}
                    onChange={(e) => setPracticeFilter(e.target.value)}
                    className="h-11 rounded-xl border border-[#dce3e8] px-4 text-sm font-semibold outline-none"
                  >
                    <option value="all">All practices</option>

                    {PRACTICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {(search ||
                    statusFilter !== "all" ||
                    practiceFilter !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="h-11 rounded-xl border border-[#dce3e8] px-4 text-sm font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <Loading />
              ) : filteredLeads.length === 0 ? (
                <Empty />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-b bg-[#fbfcfd]">
                        <Header>Practice</Header>
                        <Header>Contact</Header>
                        <Header>Practice Type</Header>
                        <Header>Opportunity</Header>
                        <Header>Funnel</Header>
                        <Header>Status</Header>
                        <Header>Action</Header>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredLeads.map((lead) => (
                        <LeadRow
                          key={lead.id}
                          lead={lead}
                          onOpen={() =>
                            router.push(`/dashboard/leads/${lead.id}`)
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* PIPELINE */}

          {view === "pipeline" && (
            <div className="overflow-x-auto p-6">
              <div className="grid min-w-[1350px] grid-cols-6 gap-4">
                {pipelineLeads.map((stage) => {
                  const stageRevenue = stage.leads.reduce(
                    (sum, lead) => sum + Number(lead.lost_revenue_monthly || 0),
                    0,
                  );

                  return (
                    <div
                      key={stage.value}
                      className="min-h-[500px] rounded-2xl bg-[#f7f9fa] p-3"
                    >
                      <div className="mb-4 px-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wide text-[#344054]">
                            {stage.label}
                          </h3>

                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#718096]">
                            {stage.leads.length}
                          </span>
                        </div>

                        <p className="mt-2 text-[10px] text-[#98a2b3]">
                          {money(stageRevenue)} opportunity
                        </p>
                      </div>

                      <div className="space-y-3">
                        {stage.leads.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() =>
                              router.push(`/dashboard/leads/${lead.id}`)
                            }
                            className="w-full rounded-xl border border-[#e3e8eb] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F7490] hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar name={lead.practice_name} />

                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[#172033]">
                                  {lead.practice_name || "Unknown Practice"}
                                </p>

                                <p className="mt-1 truncate text-[10px] text-[#98a2b3]">
                                  {lead.email || "No email"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-bold text-[#0F7490]">
                                {money(Number(lead.lost_revenue_monthly || 0))}
                              </p>

                              <p className="mt-1 text-[9px] text-[#98a2b3]">
                                monthly opportunity
                              </p>
                            </div>

                            <div className="mt-3">
                              <span className="rounded-md bg-[#e8f5f8] px-2 py-1 text-[9px] font-bold text-[#0F7490]">
                                {lead.practice_type || "Practice"}
                              </span>
                            </div>
                          </button>
                        ))}

                        {stage.leads.length === 0 && (
                          <div className="rounded-xl border border-dashed border-[#d8e0e5] px-3 py-10 text-center">
                            <p className="text-[10px] text-[#a0aab7]">
                              No leads
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function Metric({
  title,
  value,
  description,
  primary = false,
}: {
  title: string;
  value: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${
        primary ? "border-[#0F7490] bg-[#0F7490]" : "border-[#e1e7eb] bg-white"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
          primary ? "text-white/60" : "text-[#8795a5]"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-5 text-3xl font-bold ${
          primary ? "text-white" : "text-[#172033]"
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-2 text-xs ${
          primary ? "text-white/60" : "text-[#98a2b3]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function SmallMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e1e7eb] bg-white px-6 py-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8795a5]">
        {title}
      </p>

      <p className="mt-2 text-lg font-bold text-[#172033]">{value}</p>
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#8795a5]">
      {children}
    </th>
  );
}

function LeadRow({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  return (
    <tr className="border-b border-[#edf1f3] hover:bg-[#fbfcfd]">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar name={lead.practice_name} />

          <div>
            <p className="max-w-[180px] truncate text-sm font-bold">
              {lead.practice_name || "Unknown Practice"}
            </p>

            <p className="mt-1 text-xs text-[#98a2b3]">
              {formatDate(lead.created_at)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="max-w-[220px] truncate text-sm font-medium">
          {lead.email || "No email"}
        </p>
      </td>

      <td className="px-6 py-5">
        <span className="rounded-lg bg-[#e8f5f8] px-2.5 py-1.5 text-[10px] font-bold text-[#0F7490]">
          {lead.practice_type || "Not specified"}
        </span>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-bold">
          {money(Number(lead.lost_revenue_monthly || 0))}
        </p>

        <p className="text-[10px] text-[#98a2b3]">monthly</p>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-1">
          {[
            lead.calculator_completed,
            lead.email_captured,
            lead.report_purchased,
            lead.report_generated,
            lead.booking_cta_clicked || lead.status === "call_booked",
            lead.status === "client",
          ].map((done, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${
                done ? "bg-[#0F7490]" : "bg-[#dfe5e9]"
              }`}
            />
          ))}
        </div>
      </td>

      <td className="px-6 py-5">
        <Status status={lead.status || "new"} />
      </td>

      <td className="px-6 py-5">
        <button
          onClick={onOpen}
          className="rounded-xl border border-[#dce3e8] px-4 py-2 text-xs font-bold hover:border-[#0F7490] hover:text-[#0F7490]"
        >
          View Lead →
        </button>
      </td>
    </tr>
  );
}

function Status({ status }: { status: string }) {
  const labels: Record<string, string> = {
    new: "New",
    report_paid: "Report Purchased",
    call_booked: "Call Booked",
    proposal_sent: "Proposal Sent",
    client: "Client Won",
    lost: "Lost",
  };

  return (
    <span className="whitespace-nowrap rounded-lg bg-[#edf1f5] px-2.5 py-1.5 text-[10px] font-bold text-[#536174]">
      {labels[status] || status}
    </span>
  );
}

function Avatar({ name }: { name: string | null }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f4f7] text-sm font-bold text-[#0F7490]">
      {name?.trim()?.charAt(0)?.toUpperCase() || "L"}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e5eaed] border-t-[#0F7490]" />

        <p className="mt-4 text-sm text-[#8795a5]">Loading leads...</p>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-bold">No leads found</p>

        <p className="mt-2 text-sm text-[#8795a5]">
          Try changing your search or filters.
        </p>
      </div>
    </div>
  );
}

function money(value: number) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
