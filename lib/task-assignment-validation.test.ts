import { describe, expect, it } from "vitest";
import { taskAssignmentSchema } from "@/lib/validation";

describe("task assignment validation", () => {
  it("requires an assignee while accepting and normalizing optional task notes", () => {
    expect(taskAssignmentSchema.parse({ assignedToEmail: " TEAM@PLUS.ORG ", taskNotes: "  Follow up with the vendor.  " })).toEqual({ assignedToEmail: "team@plus.org", taskNotes: "Follow up with the vendor." });
    expect(taskAssignmentSchema.parse({ assignedToEmail: "team@plus.org" })).toEqual({ assignedToEmail: "team@plus.org", taskNotes: "" });
    expect(taskAssignmentSchema.parse({ assignedToEmail: "team@plus.org", taskNotes: "   " })).toEqual({ assignedToEmail: "team@plus.org", taskNotes: "" });
    expect(() => taskAssignmentSchema.parse({ assignedToEmail: "" })).toThrow();
    expect(() => taskAssignmentSchema.parse({ assignedToEmail: "invalid" })).toThrow();
  });
});
