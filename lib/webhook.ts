import type { RosterMember } from "@/lib/types";

export type OperationRequest = {
  rowNumber?: number;
  id?: string | number;
  timestamp?: string | Date;
  staffName?: string;
  staffEmail?: string;
  department?: string;
  requestType?: string;
  category?: string;
  justification?: string;
  status?: string;
  remarks?: string;
  assignedTo?: string;
  decisionLog?: string;
  taskStatus?: string;
  taskRemarks?: string;
  workflowStage?: string;
  pendingReviewer?: string;
  projectCode?: string;
  amount?: number;
  durationDays?: number;
  requiresExecutive?: boolean;
  tier1Reviewer?: string;
  tier2Reviewer?: string;
  deliverableLink?: string;
  cancellationReason?: string;
  [key: string]: any;
};

function getScriptUrl(): string {
  const url = process.env.APPS_SCRIPT_URL || "";
  if (!url) {
    throw new Error("APPS_SCRIPT_URL environment variable is not configured");
  }
  return url.trim();
}

/**
 * Robust fetcher that safely handles Google Apps Script redirects and parses JSON
 */
async function fetchFromAppsScript(url: string) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Non-JSON response from Apps Script:", text.slice(0, 300));
    throw new Error(`Apps Script did not return JSON. Preview: ${text.slice(0, 100)}`);
  }
}

export async function listRequests(): Promise<OperationRequest[]> {
  try {
    const baseUrl = getScriptUrl();
    const url = baseUrl.includes("?")
      ? `${baseUrl}&action=getRequests`
      : `${baseUrl}?action=getRequests`;

    const json = await fetchFromAppsScript(url);
    const data = json.data || json.requests || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("listRequests error:", error);
    return [];
  }
}

export async function listRoster(): Promise<RosterMember[]> {
  try {
    const baseUrl = getScriptUrl();
    const url = baseUrl.includes("?")
      ? `${baseUrl}&action=getRoster`
      : `${baseUrl}?action=getRoster`;

    const json = await fetchFromAppsScript(url);
    const data = json.roster || json.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("listRoster error:", error);
    return [];
  }
}

export async function updateRequestStatus(payload: {
  id?: string | number;
  rowNumber?: number;
  status: string;
  remarks?: string;
  assignedTo?: string;
  decisionLog?: string;
}): Promise<{ ok: boolean; message?: string }> {
  const baseUrl = getScriptUrl();
  const res = await fetch(baseUrl, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "UPDATE_STATUS",
      ...payload,
    }),
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: res.ok };
  }
}
