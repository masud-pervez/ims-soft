import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function WelcomeBanner() {
  return (
    <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 bg-muted relative overflow-hidden md:col-span-12 lg:col-span-4">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="font-semibold text-2xl">
          Congratulations Toby! 🎉
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Best seller of the month
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-3xl">$15,231.89</div>
            <div className="text-muted-foreground text-xs">
              <span className="text-green-500">+65%</span> from last month
            </div>
          </div>
          <Button variant="outline">View Sales</Button>
        </div>
      </CardContent>
      {/* Assuming star-shape.png exists or this needs to be a placeholder for now */}
      {/* <img
        alt="..."
        loading="lazy"
        width="800"
        height="300"
        decoding="async"
        className="pointer-events-none absolute inset-0 aspect-auto"
        src="/star-shape.png"
        style={{ color: "transparent" }}
      /> */}
    </Card>
  );
}
