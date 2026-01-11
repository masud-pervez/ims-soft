"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div className="flex flex-col">
          <CardTitle className="leading-none font-semibold">
            Total Revenue
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Income in the last 28 days
          </CardDescription>
        </div>

        <div className="row-span-2 self-start relative col-start-auto row-start-auto justify-self-start lg:col-start-2 lg:row-start-1 lg:justify-self-end">
          <div className="end-0 top-0 mt-2 flex flex-col items-stretch space-y-0 p-0 sm:flex-row lg:absolute lg:mt-0">
            <div className="flex gap-8 rounded-lg border p-4">
              <Button
                variant="ghost"
                className="flex flex-1 flex-col justify-center gap-2 text-left h-auto p-0 hover:bg-transparent"
              >
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  Desktop
                </span>
                <span className="font-display text-lg leading-none sm:text-2xl">
                  24,828
                </span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-1 flex-col justify-center gap-2 text-left h-auto p-0 hover:bg-transparent"
              >
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  Mobile
                </span>
                <span className="font-display text-lg leading-none sm:text-2xl">
                  25,010
                </span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
