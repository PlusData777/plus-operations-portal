export type DateRange = "month" | "30d" | "ytd";

export const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "month", label: "This Month" },
  { key: "30d", label: "Last 30 Days" },
  { key: "ytd", label: "Year to Date" },
];

export type Department = "Operations" | "Programs" | "Legal Aid";

export const DEPARTMENTS: { key: Department; color: string }[] = [
  { key: "Operations", color: "#1d3557" },
  { key: "Programs", color: "#16a34a" },
  { key: "Legal Aid", color: "#d97706" },
];

export type Metric = {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  hint: string;
};

export type ExpensePoint = {
  month: string;
  Operations: number;
  Programs: number;
  "Legal Aid": number;
};

export type StatusSlice = { name: string; value: number; color: string };

export type TransactionCategory = "Operations" | "Programs" | "Legal Aid" | "Payroll" | "Travel";

export type Transaction = {
  id: string;
  reference: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  date: string;
  approver: string;
  status: "Approved" | "Tier 2 Review";
};

export type AnalyticsSnapshot = {
  metrics: Metric[];
  expenseTrend: ExpensePoint[];
  statusBreakdown: StatusSlice[];
  transactions: Transaction[];
};

const CATEGORY_STYLES: Record<TransactionCategory, { badge: string }> = {
  Operations: { badge: "bg-navy/10 text-navy" },
  Programs: { badge: "bg-emerald/10 text-emerald" },
  "Legal Aid": { badge: "bg-amber-100 text-amber-700" },
  Payroll: { badge: "bg-slate-200 text-slate-700" },
  Travel: { badge: "bg-sky-100 text-sky-700" },
};

export function categoryBadgeClass(category: TransactionCategory): string {
  return CATEGORY_STYLES[category].badge;
}

export const PKR = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

export function formatCompactPKR(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function trend(base: number, spread: number, points: number): ExpensePoint[] {
  return MONTHS.slice(-points).map((month, index) => ({
    month,
    Operations: Math.round(base + spread * (0.6 + 0.4 * Math.sin(index)) + index * 45_000),
    Programs: Math.round(base * 0.82 + spread * (0.5 + 0.5 * Math.cos(index)) + index * 30_000),
    "Legal Aid": Math.round(base * 0.65 + spread * (0.4 + 0.6 * Math.sin(index + 1)) + index * 22_000),
  }));
}

export const SNAPSHOTS: Record<DateRange, AnalyticsSnapshot> = {
  month: {
    metrics: [
      { label: "Approvals Pending", value: "18", delta: 12.5, deltaLabel: "vs last month", hint: "Across Tier 1 & Tier 2 queues" },
      { label: "Expenses Processed", value: PKR.format(4_820_000), delta: 8.2, deltaLabel: "vs last month", hint: "142 approved disbursements" },
      { label: "Active Field Cases", value: "63", delta: -4.1, deltaLabel: "vs last month", hint: "9 districts covered" },
      { label: "Staff on Leave", value: "7", delta: 2.0, deltaLabel: "vs last month", hint: "3 pending return this week" },
    ],
    expenseTrend: trend(520_000, 240_000, 3),
    statusBreakdown: [
      { name: "Approved", value: 142, color: "#16a34a" },
      { name: "Tier 1 Review", value: 11, color: "#1d3557" },
      { name: "Tier 2 Review", value: 7, color: "#d97706" },
      { name: "Rejected", value: 9, color: "#dc2626" },
    ],
    transactions: baseTransactions(),
  },
  "30d": {
    metrics: [
      { label: "Approvals Pending", value: "24", delta: 18.0, deltaLabel: "vs prior 30 days", hint: "Across Tier 1 & Tier 2 queues" },
      { label: "Expenses Processed", value: PKR.format(6_140_000), delta: 11.7, deltaLabel: "vs prior 30 days", hint: "188 approved disbursements" },
      { label: "Active Field Cases", value: "71", delta: 3.4, deltaLabel: "vs prior 30 days", hint: "11 districts covered" },
      { label: "Staff on Leave", value: "9", delta: -1.5, deltaLabel: "vs prior 30 days", hint: "4 pending return this week" },
    ],
    expenseTrend: trend(540_000, 260_000, 5),
    statusBreakdown: [
      { name: "Approved", value: 188, color: "#16a34a" },
      { name: "Tier 1 Review", value: 15, color: "#1d3557" },
      { name: "Tier 2 Review", value: 9, color: "#d97706" },
      { name: "Rejected", value: 13, color: "#dc2626" },
    ],
    transactions: baseTransactions(),
  },
  ytd: {
    metrics: [
      { label: "Approvals Pending", value: "31", delta: 6.9, deltaLabel: "vs last year", hint: "Across Tier 1 & Tier 2 queues" },
      { label: "Expenses Processed", value: PKR.format(38_540_000), delta: 22.4, deltaLabel: "vs last year", hint: "1,204 approved disbursements" },
      { label: "Active Field Cases", value: "218", delta: 14.8, deltaLabel: "vs last year", hint: "17 districts covered" },
      { label: "Staff on Leave", value: "12", delta: 0.8, deltaLabel: "vs last year", hint: "5 pending return this week" },
    ],
    expenseTrend: trend(560_000, 300_000, 8),
    statusBreakdown: [
      { name: "Approved", value: 1204, color: "#16a34a" },
      { name: "Tier 1 Review", value: 42, color: "#1d3557" },
      { name: "Tier 2 Review", value: 31, color: "#d97706" },
      { name: "Rejected", value: 87, color: "#dc2626" },
    ],
    transactions: baseTransactions(),
  },
};

function baseTransactions(): Transaction[] {
  return [
    { id: "1", reference: "PLUS-EXP-2041", description: "Legal aid clinic — Karachi South", category: "Legal Aid", amount: 1_240_000, date: "2026-08-24", approver: "R. Qureshi", status: "Approved" },
    { id: "2", reference: "PLUS-EXP-2039", description: "Field operations vehicle lease", category: "Operations", amount: 890_000, date: "2026-08-22", approver: "A. Malik", status: "Approved" },
    { id: "3", reference: "PLUS-EXP-2036", description: "Community paralegal training — Q3", category: "Programs", amount: 640_000, date: "2026-08-21", approver: "S. Nawaz", status: "Tier 2 Review" },
    { id: "4", reference: "PLUS-EXP-2034", description: "Staff payroll disbursement", category: "Payroll", amount: 2_310_000, date: "2026-08-19", approver: "R. Qureshi", status: "Approved" },
    { id: "5", reference: "PLUS-EXP-2031", description: "Regional advocacy travel — Lahore", category: "Travel", amount: 415_000, date: "2026-08-18", approver: "F. Hussain", status: "Approved" },
    { id: "6", reference: "PLUS-EXP-2028", description: "Case management software renewal", category: "Operations", amount: 720_000, date: "2026-08-15", approver: "A. Malik", status: "Tier 2 Review" },
    { id: "7", reference: "PLUS-EXP-2025", description: "Women's rights outreach campaign", category: "Programs", amount: 985_000, date: "2026-08-12", approver: "S. Nawaz", status: "Approved" },
  ];
}
