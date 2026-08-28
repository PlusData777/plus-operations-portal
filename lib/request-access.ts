import { normalizedEmail } from "@/lib/authorization";
import type { PortalRequest } from "@/lib/types";

export function personalRequests(requests: PortalRequest[], email: string) {
  const requesterEmail = normalizedEmail(email);
  return requests.filter(request => normalizedEmail(request.staffEmail) === requesterEmail);
}

export function assignedRequests(requests: PortalRequest[], email: string) {
  const assigneeEmail = normalizedEmail(email);
  return requests.filter(request => normalizedEmail(request.assignedTo ?? "") === assigneeEmail);
}

export function canCancelRequest(request: PortalRequest, email: string) {
  return request.status === "Pending" && normalizedEmail(request.staffEmail) === normalizedEmail(email);
}

export function canUpdateAssignedTask(request: PortalRequest, email: string) {
  return normalizedEmail(request.assignedTo ?? "") === normalizedEmail(email);
}
