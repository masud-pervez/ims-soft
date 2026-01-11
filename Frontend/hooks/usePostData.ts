import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/axios";

type HttpMethod = "post" | "put" | "delete" | "patch";

interface PostDataParams<T> {
  url: string;
  method?: HttpMethod;
  data?: unknown; // Request body for post/put/patch
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  invalidateKey?: string[]; // Keys to invalidate after success
}

export function usePostData<T, TError = unknown>() {
  const queryClient = useQueryClient();

  return useMutation<T, TError, PostDataParams<T>>({
    mutationFn: async ({ url, method = "post", data }) => {
      const response = await api[method]<T>(url, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (variables.invalidateKey) {
        queryClient.invalidateQueries({ queryKey: variables.invalidateKey });
      }
      if (variables.onSuccess) {
        variables.onSuccess(data);
      }
    },
    onError: (error, variables) => {
      if (variables.onError) {
        variables.onError(error);
      }
    },
  });
}
