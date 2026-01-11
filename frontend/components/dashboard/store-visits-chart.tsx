"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Direct",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Social",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Email",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Referrals",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function StoreVisitsChart() {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 lg:col-span-6 xl:col-span-3">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="leading-none font-semibold">
          Store Visits by Source
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
