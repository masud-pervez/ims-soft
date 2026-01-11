import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const stats: StatsCardProps[] = [
  {
    title: "Monthly recurring revenue",
    value: "$34.1K",
    change: "+6.1%",
    trend: "up",
  },
  {
    title: "Users",
    value: "500.1K",
    change: "+19.2%",
    trend: "up",
  },
  {
    title: "User growth",
    value: "11.3%",
    change: "-1.2%",
    trend: "down",
  },
];

export function StatsCards() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-0"
        >
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start justify-between space-x-2">
              <span className="text-muted-foreground truncate text-sm">
                {stat.title}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.trend === "up"
                    ? "text-emerald-700 dark:text-emerald-500"
                    : "text-red-700 dark:text-red-500"
                )}
              >
                {stat.change}
              </span>
            </div>
            <dd className="text-foreground mt-1 text-3xl font-semibold">
              {stat.value}
            </dd>
          </CardContent>
          <CardFooter className="items-center px-6 [.border-t]:pt-6 border-border flex justify-end border-t p-0!">
            <Link
              className="text-primary hover:text-primary/90 flex items-center px-6 py-3 text-sm font-medium"
              href="#"
            >
              View more <ArrowRight className="ms-2 size-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
