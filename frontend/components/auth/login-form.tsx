/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCog,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { setCookie } from "@/lib/auth-utils";

import { usePostData } from "@/hooks/usePostData";
import { Button } from "@/components/ui/button";
import { useUserActions } from "@/store/user-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user-store.types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginResponse = {
  status: boolean;
  message: string;
  Data: {
    token: string;
    user: User;
  };
};

const testCredentials = [
  {
    role: "Super Admin",
    email: "superadmin@gmail.com",
    password: "12345678",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
  },
  {
    role: "Admin",
    email: "admin@gmail.com",
    password: "12345678",
    icon: UserCog,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
  },
  {
    role: "Staff",
    email: "staff@gmail.com",
    password: "12345678",
    icon: UserIcon,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
  },
];

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(true);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser, setToken } = useUserActions();
  const { mutate: login, isPending: isLoading } = usePostData<LoginResponse>();

  async function onSubmit(data: LoginFormValues) {
    login(
      {
        url: "/auth/login",
        data,
      },
      {
        onSuccess: (res) => {
          const { token, user } = res.Data;
          setUser(user);
          setToken(token);
          setCookie("token", token);

          toast.success("Welcome back!");
          router.push("/overview");
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Login failed";
          toast.error(errorMessage);
        },
      }
    );
  }

  function fillCredentials(email: string, password: string) {
    form.setValue("email", email);
    form.setValue("password", password);
    setShowPassword(true);
    toast.info("Credentials filled! Click 'Sign In' to login.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 px-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Quick Login Suggestions - Development Only */}
        <div className="mt-6 border-t pt-6">
          <button
            type="button"
            onClick={() => setShowQuickLogin(!showQuickLogin)}
            className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <span>Quick Login (Test Accounts)</span>
            <span className="text-xs">{showQuickLogin ? "▼" : "▶"}</span>
          </button>

          {showQuickLogin && (
            <div className="space-y-2">
              {testCredentials.map((cred) => {
                const Icon = cred.icon;
                return (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => fillCredentials(cred.email, cred.password)}
                    className={`w-full p-3 rounded-lg border ${cred.borderColor} ${cred.bgColor} transition-all duration-200 hover:shadow-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${cred.color} flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold text-sm ${cred.color}`}>
                          {cred.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cred.email}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground bg-white px-2 py-1 rounded border">
                        {cred.password}
                      </div>
                    </div>
                  </button>
                );
              })}
              <p className="text-xs text-muted-foreground text-center mt-3">
                Click any card to auto-fill credentials
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
