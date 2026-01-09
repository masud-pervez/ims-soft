import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "../types";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      return user;
    },
    initialData: () => {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    },
    staleTime: Infinity, // User data doesn't change often unless updated
  });
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update Query Cache
      queryClient.setQueryData(["user"], data.user);

      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      // If backend returns { user, token } on register:
      if (data.token && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        queryClient.setQueryData(["user"], data.user);

        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.success("Account created! Please login.");
        navigate("/login");
      }
    },
    onError: (error: any) => {
      console.error(error);
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.setQueryData(["user"], null);
    queryClient.clear(); // Clear all queries

    toast.info("Logged out.");
    navigate("/login");
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
