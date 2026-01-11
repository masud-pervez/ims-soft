import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "./api";

export interface PostDataMutationInput<T> {
  url: string;
  postData?: T;
  isMultipart?: boolean;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
}

export interface UsePostDataOptions<TPostData, TResponse> {
  invalidateQueries?: string[];
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
  mutationOptions?: UseMutationOptions<
    ApiResponse<TResponse>,
    Error,
    PostDataMutationInput<TPostData>
  >;
  doNotShowToast?: boolean;
}
