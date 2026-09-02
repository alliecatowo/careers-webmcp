
export type AppErrorType =
  | "NETWORK"
  | "AUTH"
  | "PERMISSION"
  | "VALIDATION"
  | "NOT_FOUND"
  | "SERVER"
  | "UNKNOWN";

export interface AppError {
  type: AppErrorType;
  message: string;
  code?: string; // e.g., 'auth/invalid-credentials' from a backend
  status?: number; // HTTP status code
  details?: any; // For extra details like validation error fields
  retryable?: boolean;
}
