export type Status = "On track" | "Needs support" | "Urgent" | "Completed";
export type CheckIn = { id: string; date: string; createdAt?: string; goal: string; progress: string; confidence: number; obstacles: string; request: string };
export type FollowUp = { id: string; date: string; action: string; owner: string; note: string };
export type Learner = { id: string; name: string; initials: string; cohort: string; week: number; status: Status; checkIns: CheckIn[]; followUps: FollowUp[] };
export type CheckInInput = Pick<CheckIn, "goal" | "progress" | "confidence" | "obstacles" | "request">;
export type CheckInValidationKey = "validationGoal" | "validationProgress" | "validationConfidence";

export function validateCheckIn(input: Partial<CheckInInput>) {
  const errors: Partial<Record<keyof CheckInInput, CheckInValidationKey>> = {};
  if (!input.goal?.trim()) errors.goal = "validationGoal";
  if (!input.progress?.trim()) errors.progress = "validationProgress";
  if (!Number.isInteger(input.confidence) || Number(input.confidence) < 1 || Number(input.confidence) > 5) errors.confidence = "validationConfidence";
  return { errors, valid: Object.keys(errors).length === 0 };
}

/** A submission ID is created once per form session and doubles as its idempotency key. */
export function recordCheckIn(learners: Learner[], learnerId: string, input: CheckInInput, submissionId: string, now = new Date()) {
  if (learners.some(learner => learner.checkIns.some(checkIn => checkIn.id === submissionId))) {
    return { learners, duplicate: true as const };
  }
  const validation = validateCheckIn(input);
  if (!validation.valid) return { learners, duplicate: false as const, errors: validation.errors };
  const checkIn: CheckIn = {
    id: submissionId,
    date: now.toISOString().slice(0, 10),
    createdAt: now.toISOString(),
    goal: input.goal.trim(),
    progress: input.progress.trim(),
    confidence: input.confidence,
    obstacles: input.obstacles.trim(),
    request: input.request.trim(),
  };
  return {
    duplicate: false as const,
    checkIn,
    learners: learners.map(learner => learner.id === learnerId ? {
      ...learner,
      checkIns: [checkIn, ...learner.checkIns],
      status: checkIn.confidence <= 2 || checkIn.request ? "Needs support" : learner.status === "Urgent" ? "Needs support" : learner.status,
    } : learner),
  };
}

export function priorityScore(learner: Learner) {
  if (learner.status === "Completed") return 0;
  const latest = learner.checkIns[0];
  let score = learner.status === "Urgent" ? 5 : learner.status === "Needs support" ? 3 : 0;
  if (latest?.confidence <= 2) score += 3;
  if (latest?.request.trim()) score += 2;
  if (latest?.obstacles.trim()) score += 1;
  if (!learner.followUps.length || (latest && new Date(latest.date) > new Date(learner.followUps[0].date))) score += 1;
  return score;
}

export function priorityLabel(score: number) { return score >= 7 ? "Today" : score >= 4 ? "This week" : score > 0 ? "When available" : "All clear"; }
