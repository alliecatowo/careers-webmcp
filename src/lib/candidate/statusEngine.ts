export const PIPELINE_STAGES = {
  APPLIED: "Application Submitted",
  SCREENED: "Screening",
  TECHNICAL_ROUND: "Technical Round",
  HR_ROUND: "HR Round",
  FINAL_ROUND: "Final Round",
  OFFER: "Offer Extended",
  HIRED: "Hired",
  REJECTED: "Application Rejected",
} as const;

export type PipelineStage = keyof typeof PIPELINE_STAGES;

export function getStageLabel(stage: PipelineStage | string) {
  return PIPELINE_STAGES[stage as PipelineStage] || "Unknown Stage";
}

export function getStageColor(stage: PipelineStage | string) {
  switch (stage) {
    case "APPLIED":
    case "SCREENED":
      return "bg-blue-500";
    case "TECHNICAL_ROUND":
    case "HR_ROUND":
    case "FINAL_ROUND":
      return "bg-yellow-500";
    case "OFFER":
      return "bg-purple-500";
    case "HIRED":
      return "bg-green-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

export function isApplicationActive(stage: PipelineStage | string): boolean {
  return !["HIRED", "REJECTED"].includes(stage);
}
