"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { User } from "@/types/api";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["STAFF", "ADMIN", "SUPER_ADMIN"]),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional()
    .or(z.literal("")),
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isEditing = !!user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "STAFF",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        role: user.role,
        password: "",
      });
    } else {
      form.reset({
        username: "",
        email: "",
        role: "STAFF",
        password: "",
      });
    }
  }, [user, form, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = { ...values };
    if (isEditing && !payload.password) {
      delete payload.password;
    }

    if (isEditing && user) {
      updateUser.mutate(
        { id: user.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } else {
      // Create user logic
      const createPayload = {
        username: values.username,
        email: values.email,
        password: values.password || "12345678",
        role: values.role,
      };

      if (!isEditing && !values.password) {
        form.setError("password", {
          message: "Password is required for new users.",
        });
        return;
      }

      createUser.mutate(createPayload, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  }

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the user profile here."
              : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? "(Unchanged)" : "******"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save changes" : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
