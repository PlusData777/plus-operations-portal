import { z } from "zod";
import { PROJECT_CODES } from "@/lib/types";

const text = (max: number) => z.string().trim().min(1, "This field is required.").max(max, `Maximum ${max} characters allowed.`).transform(value => value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim());
const optionalText = (max: number) => z.string().optional().default("").transform(value => value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim()).pipe(z.string().max(max, `Maximum ${max} characters allowed.`));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.");
const positiveMoney = z.coerce.number().finite().positive("Enter an amount greater than zero.").max(50_000_000, "Amount exceeds the allowed limit.");
const optionalUrl = z.string().optional().default("").transform(value => value.trim()).pipe(z.string().max(2048, "Maximum 2048 characters allowed.").refine(value => !value || /^https:\/\//i.test(value), "Enter a secure https:// Drive link."));
const projectCode = z.enum(PROJECT_CODES);

const leaveRequestSchema = z.object({
  category: z.literal("LEAVE"),
  projectCode,
  justification: text(3000),
  leaveType: z.enum(["Casual", "Sick", "Annual", "Emergency"]),
  leaveStartDate: date,
  leaveEndDate: date,
  handoverColleagueEmail: z.string().trim().email("Choose a valid handover colleague.").max(320).transform(value => value.toLowerCase()),
}).superRefine((value, context) => {
  if (value.leaveEndDate < value.leaveStartDate) context.addIssue({ code: z.ZodIssueCode.custom, path: ["leaveEndDate"], message: "End date must be on or after the start date." });
});

const financeRequestSchema = z.object({
  category: z.literal("FINANCE"),
  projectCode,
  justification: text(3000),
  expenseType: z.enum(["Travel", "Vendor", "Office", "Meal"]),
  amountPkr: positiveMoney,
  expenseDate: date,
  receiptDriveLink: optionalUrl,
  paymentPreference: z.enum(["Cash", "Bank Transfer"]),
});

const procurementRequestSchema = z.object({
  category: z.literal("PROCUREMENT"),
  projectCode,
  justification: text(3000),
  itemDescription: text(1200),
  quantity: z.coerce.number().int("Quantity must be a whole number.").min(1, "Quantity must be at least 1.").max(100_000, "Quantity exceeds the allowed limit."),
  urgencyLevel: z.enum(["Normal", "Urgent", "Immediate"]),
  deliveryLocation: text(300),
});

const programRequestSchema = z.object({
  category: z.literal("PROGRAM"),
  projectCode,
  justification: text(3000),
  projectNameOrCode: text(300),
  activityLocation: text(300),
  budgetEstimatePkr: positiveMoney,
  transportRequired: z.boolean(),
});

export const requestSchema = z.union([leaveRequestSchema, financeRequestSchema, procurementRequestSchema, programRequestSchema]);
export const decisionSchema = z.object({ status: z.enum(["Approved", "Rejected"]), decisionRemarks: text(1200) });
export const taskAssignmentSchema = z.object({ assignedToEmail: z.string().trim().email("Choose a valid active staff member.").max(320).transform(value => value.toLowerCase()), taskNotes: optionalText(1200) });
export const cancellationSchema = z.object({ cancellationReason: text(1200) });
export const taskStatusUpdateSchema = z.object({ taskStatus: z.enum(["In Progress", "Completed", "Needs Clarification"]), taskRemarks: text(1200), deliverableLink: optionalUrl }).superRefine((value, context) => { if (value.taskStatus === "Completed" && !value.deliverableLink) context.addIssue({ code: z.ZodIssueCode.custom, path: ["deliverableLink"], message: "A secure deliverable or evidence URL is required when completing a task." }); });
export type RequestInput = z.infer<typeof requestSchema>;
export type TaskAssignmentInput = z.infer<typeof taskAssignmentSchema>;
export type TaskStatusUpdateInput = z.infer<typeof taskStatusUpdateSchema>;
