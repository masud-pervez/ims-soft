/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/users";
import { User, UserPermissionsPayload, UserStatusPayload } from "@/types/api"; // Assuming UserStatusPayload exists or I'll add it
import { toast } from "sonner"; // Using sonner for toasts as seen in package.json

export const useGetUsers = (params?: object) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getAll(params),
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      { id, data }: { id: string; data: Partial<User> | any } // Type relaxation slightly to allow diff payloads if needed
    ) => userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserPermissionsPayload }) =>
      userApi.updatePermissions(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users", id] }); // Invalidate specific user
      queryClient.invalidateQueries({ queryKey: ["users"] }); // And list
      toast.success("Permissions updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    },
  });
};
