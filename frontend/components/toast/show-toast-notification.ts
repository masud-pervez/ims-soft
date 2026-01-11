import { toast } from "sonner";

interface ToastOptions {
  message: string;
  variant?: "success" | "error" | "info" | "warning";
}

export const showToastNotification = ({
  message,
  variant = "info",
}: ToastOptions) => {
  switch (variant) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
      break;
  }
};
