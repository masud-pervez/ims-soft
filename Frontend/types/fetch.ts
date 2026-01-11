import { UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "./api";

export interface FetchQueryOptions<T>
  extends Omit<UseQueryOptions<ApiResponse<T>, Error>, "queryKey" | "queryFn"> {
  // Add any custom options here if needed
}

export interface UseFetchDataOptions<T> {
  url: string;
  params?: Record<string, any>;
  isEnabled?: boolean | (() => boolean);
  queryOptions?: FetchQueryOptions<T>;
  retry?: number | boolean;
}
