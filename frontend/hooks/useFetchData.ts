import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { showToastNotification } from "@/components/toast/show-toast-notification";
import {
  fetchDelete,
  fetchGet,
  fetchPatch,
  fetchPost,
  fetchPut,
} from "@/lib/fetch/custom-fetch";
import { ApiResponse } from "@/types/api";
import {
  PostDataMutationInput,
  UsePostDataOptions,
} from "@/types/post-data.types";
import { FetchQueryOptions, UseFetchDataOptions } from "@/types/fetch";

// Re-export this if needed or just use it here
type UsePostDataResult<TPostData, TResponse> = UseMutationResult<
  ApiResponse<TResponse>,
  Error,
  PostDataMutationInput<TPostData>
>;

export const useFetchData = <TFull = unknown>({
  url,
  params = {},
  isEnabled = true,
  queryOptions,
  retry = 0,
}: UseFetchDataOptions<TFull>) => {
  const queryKey = [url, { ...params }];

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery<ApiResponse<TFull>, Error>({
    queryKey,
    queryFn: async (): Promise<ApiResponse<TFull>> => {
      return await fetchGet<TFull>(url, params);
    },
    enabled: typeof isEnabled === "function" ? isEnabled() : isEnabled,
    retry,
    ...(queryOptions as unknown as FetchQueryOptions<TFull>),
  });

  const data = apiResponse?.data;
  const pagination = apiResponse?.meta?.pagination;

  return {
    data,
    response: apiResponse,
    pagination,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    refetch,
  } as const;
};

const executeRequest = async <TPostData, TResponse>({
  url,
  postData,
  isMultipart = false,
  method = "POST",
  headers,
}: PostDataMutationInput<TPostData>): Promise<ApiResponse<TResponse>> => {
  const requestData =
    (postData as Record<string, unknown> | FormData | null | undefined) ?? null;

  switch (method) {
    case "PATCH":
      return await fetchPatch<TResponse>(url, requestData, {
        isMultipart,
        headers,
      });
    case "PUT":
      return await fetchPut<TResponse>(url, requestData, {
        isMultipart,
        headers,
      });
    case "DELETE":
      return await fetchDelete<TResponse>(url, requestData, {
        isMultipart,
        headers,
      });
    default:
      return await fetchPost<TResponse>(url, requestData, {
        isMultipart,
        headers,
      });
  }
};

const handleError = (
  error: unknown,
  onError?: (error: Error) => void,
  doNotShowToast?: boolean
): void => {
  let errorMessage: string;
  let errorObject: Error;

  if (typeof error === "string") {
    errorMessage = error;
    errorObject = new Error(error);
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorObject = error;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as { message: unknown }).message);
    errorObject = new Error(errorMessage);
  } else if (error && typeof error === "object" && "error" in error) {
    errorMessage = String((error as { error: unknown }).error);
    errorObject = new Error(errorMessage);
  } else {
    errorMessage = "An unexpected error occurred.";
    errorObject = new Error(errorMessage);
  }

  if (onError) onError(errorObject);

  if (!doNotShowToast) {
    showToastNotification({
      message: errorMessage,
      variant: "error",
    });
  }
};

const handleSuccess = <TResponse>(
  data: ApiResponse<TResponse>,
  onSuccess?: (data: TResponse) => void,
  doNotShowToast?: boolean
): void => {
  if (onSuccess && data.data !== undefined) {
    onSuccess(data.data);
  }

  if (!doNotShowToast && data?.message) {
    showToastNotification({
      message: data.message,
      variant: data.success === false ? "error" : "success",
    });
  }
};

// We need queryClient to invalidate queries manually.
// If it's not exported from providers, we might need to create a singleton or useQueryClient hook inside the component,
// but usePostData is a hook so we can use useQueryClient().
// Let's check `components/providers.tsx` again or just use `useQueryClient` from react-query.

import { useQueryClient } from "@tanstack/react-query";

export const usePostData = <TPostData = unknown, TResponse = unknown>({
  invalidateQueries = [],
  onSuccess,
  mutationOptions,
  onError,
  doNotShowToast = false,
}: UsePostDataOptions<TPostData, TResponse> = {}): UsePostDataResult<
  TPostData,
  TResponse
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TResponse>,
    Error,
    PostDataMutationInput<TPostData>
  >({
    mutationFn: executeRequest<TPostData, TResponse>,
    onSuccess: (data) => handleSuccess(data, onSuccess, doNotShowToast),
    onError: (error) => handleError(error, onError, doNotShowToast),
    onSettled: () => {
      if (invalidateQueries.length) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: [queryKey],
          });
        });
      }
    },
    retry: false,
    ...mutationOptions,
  });
};
