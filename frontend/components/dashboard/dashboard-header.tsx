import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CalendarDateRangePicker } from "./date-range-picker";

export function DashboardHeader() {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
        E-Commerce Dashboard
      </h1>
      <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Download</span>
        </Button>
      </div>
    </div>
  );
}
