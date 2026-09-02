import { AppError } from "@/lib/errors/error.types";

export type RequestStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface RequestState<T> {
  status: RequestStatus;
  data?: T;
  error?: AppError;
}
