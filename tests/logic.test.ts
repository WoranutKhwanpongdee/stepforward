import test from "node:test";
import assert from "node:assert/strict";
import { priorityLabel, priorityScore, recordCheckIn, validateCheckIn, type CheckInInput, type Learner } from "../lib/logic.ts";

const learner: Learner = { id: "a", name: "A", initials: "A", cohort: "", week: 1, status: "Urgent", checkIns: [{ id: "1", date: "2000-01-01", goal: "", progress: "", confidence: 1, obstacles: "", request: "Help" }], followUps: [] };
test("required fields and confidence are validated", () => {
  assert.equal(validateCheckIn({ goal: "", progress: "", confidence: 6 }).valid, false);
  assert.equal(validateCheckIn({ goal: "Learn", progress: "Practiced", confidence: 4 }).valid, true);
});
test("a learner can submit different progress updates on the same day", () => {
  const input: CheckInInput = { goal: "Learn", progress: "Practiced once", confidence: 3, obstacles: "", request: "" };
  const first = recordCheckIn([learner], "a", input, "submission-1", new Date("2026-10-16T03:00:00.000Z"));
  assert.equal(first.duplicate, false);
  if (first.duplicate || "errors" in first) throw new Error("Expected first check-in to save");
  const second = recordCheckIn(first.learners, "a", { ...input, progress: "Practiced again" }, "submission-2", new Date("2026-10-16T08:00:00.000Z"));
  assert.equal(second.duplicate, false);
  if (second.duplicate || "errors" in second) throw new Error("Expected second check-in to save");
  const saved = second.learners[0].checkIns;
  assert.equal(saved.length, learner.checkIns.length + 2);
  assert.equal(saved[0].progress, "Practiced again");
  assert.equal(saved[0].createdAt, "2026-10-16T08:00:00.000Z");
  assert.equal(saved[1].createdAt, "2026-10-16T03:00:00.000Z");
  assert.notEqual(saved[0].id, saved[1].id);
});
test("repeating the same submission ID is idempotently rejected", () => {
  const input: CheckInInput = { goal: "Learn", progress: "Practiced", confidence: 4, obstacles: "", request: "" };
  const first = recordCheckIn([learner], "a", input, "same-submission", new Date("2026-10-16T03:00:00.000Z"));
  if (first.duplicate || "errors" in first) throw new Error("Expected check-in to save");
  const repeated = recordCheckIn(first.learners, "a", input, "same-submission", new Date("2026-10-16T03:00:01.000Z"));
  assert.equal(repeated.duplicate, true);
  assert.equal(repeated.learners[0].checkIns.length, learner.checkIns.length + 1);
});
test("priority rules put urgent low-confidence requests first", () => {
  assert.equal(priorityScore(learner), 11);
  assert.equal(priorityLabel(priorityScore(learner)), "Today");
  assert.equal(priorityScore({ ...learner, status: "Completed" }), 0);
});
